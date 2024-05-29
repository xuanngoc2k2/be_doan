import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Like, Repository } from 'typeorm';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) { }

  async create(createCourseDto: CreateCourseDto) {
    if (!Number.isInteger(Number(createCourseDto.level_required))) {
      throw new BadRequestException("Level Required phải là số nguyên !!")
    }
    const newCourse = await this.courseRepo.create(createCourseDto);
    return await this.courseRepo.save(newCourse);
  }

  async findAll(user?: IUser) {
    if (user) {
      const courses = await this.courseRepo
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.user_courses', 'user_course')
        .leftJoinAndSelect('course.lessons', 'lessons')
        // .where('user_course.userId = :id', { id: user.id })
        .getMany()
      // const progress = 0;
      const rs = courses.map((course) => {
        let progress = 0;
        let totalTime = 0;
        const totalUsers = course.user_courses.length;
        const { user_courses, ...cour } = course;
        user_courses.map((u) => {
          if (u.userId === user.id) {
            progress = u.progress
          }
        })
        //lesson.duration = '10:04'
        course.lessons.forEach((lesson) => {
          totalTime += this.parseDuration(lesson.duration);
        });
        return { ...cour, progress: progress, totalUsers, totalTime: this.formatTime(totalTime) }
      })
      return rs;
    }
    return this.courseRepo.find({});
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    } else {
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
  }
  parseDuration(duration: string): number {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      // hh:mm:ss
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // mm:ss
      return parts[0] * 60 + parts[1];
    } else {
      return 0;
    }
  }

  findOne(id: number) {
    return this.courseRepo.findOne({ where: { id } });
  }

  async findOneLikeName(search: string, level: number[]) {
    const queryBuilder = this.courseRepo.createQueryBuilder("course");

    // Thêm điều kiện tìm kiếm theo mô tả
    if (search) {
      queryBuilder.andWhere("course.course_name LIKE :search", { search: `%${search}%` });
    }

    // Thêm điều kiện tìm kiếm theo level_required
    if (level && level.length > 0) {
      queryBuilder.andWhere("course.level_required IN (:...level)", { level });
    }

    // Thực hiện truy vấn và trả về kết quả
    return await queryBuilder.getMany();
    return this.courseRepo.find({
      where: {
        description: Like(`%${search}%`) // Sử dụng Like và thêm % để tìm kiếm theo một phần của chuỗi
      }
    });
  }

  getCourseDetail = async (id: number, user?: IUser) => {
    const result = await this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.lessons', 'lesson')
      .leftJoinAndSelect('course.user_courses', 'user_course')
      .leftJoinAndSelect('lesson.user_lessons', 'user_lesson')
      .where("course.id = :id", { id })
      .orderBy({
        'lesson.order': 'ASC' // Sắp xếp theo trường orderColumn của bài học (hoặc trường tương ứng)
      })
      .getOne()
    const { lessons, user_courses, ...course } = result;
    let started = false;
    if (user) {
      user_courses.forEach(us => {
        if (us.userId === user.id) {
          started = true;
        }
      });
    }
    let totalTime = 0;
    lessons.forEach((lesson) => {
      totalTime += this.parseDuration(lesson.duration);
    });
    const lesson = lessons.map((l) => {
      const { user_lessons, ...les } = l;
      let isComplete = false;
      let currentTime = "0";
      if (user) {
        user_lessons.forEach((value) => {
          if (value.userId == user.id) {
            isComplete = value.isComplete;
            currentTime = value.currentTime;
          }
        })
      }
      return {
        ...les,
        isComplete,
        currentTime
      }
    })
    return { ...course, lessons: lesson, totalTime: this.formatTime(totalTime), started };
  }

  getAllCourseWithLesson = async (id: number) => {
    return await this.courseRepo.createQueryBuilder('course')
      .leftJoinAndSelect('course.lessons', 'lessons')
      .where('course.id = :id', { id }).getOne()
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const result = await this.courseRepo.update({ id: id }, { ...updateCourseDto });
    if (result.affected === 0) {
      throw new NotFoundException('Không tìm thấy khóa học để cập nhật');
    }
    return { success: true };
  }

  async remove(id: number) {
    const rs = await this.courseRepo.softDelete({ id });
    if (rs.affected === 0) {
      throw new BadRequestException("Không thể xóa được !");
    }
    return { success: true };
  }

}
