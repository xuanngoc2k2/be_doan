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
        // .where('user_course.userId = :id', { id: user.id })
        .getMany()
      // const progress = 0;
      const rs = courses.map((course) => {
        let progress = 0
        const { user_courses, ...cour } = course;
        user_courses.map((u) => {
          if (u.userId === user.id) {
            progress = u.progress
          }
        })
        return { ...cour, progress: progress }
      })
      return rs;
    }
    return this.courseRepo.find({});
  }

  findOne(id: number) {
    return this.courseRepo.find({ where: { id } });
  }

  async findOneLikeName(search: string) {
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
      .leftJoinAndSelect('lesson.user_lessons', 'user_lesson')
      .where("course.id = :id", { id })
      .orderBy({
        'lesson.order': 'ASC' // Sắp xếp theo trường orderColumn của bài học (hoặc trường tương ứng)
      })
      .getOne()
    const { lessons, ...rs } = result;
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
    return { ...rs, lessons: lesson };
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
