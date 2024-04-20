import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserCourseDto } from './dto/create-user_course.dto';
import { UpdateUserCourseDto } from './dto/update-user_course.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Repository } from 'typeorm';
import { User_Course } from './entities/user_course.entity';

@Injectable()
export class UserCourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(User_Course)
    private userCourseRepo: Repository<User_Course>
  ) {

  }

  async create(id: number, user: IUser) {
    if (Number.isNaN(id)) {
      throw new BadRequestException("Id phải là số");
    }
    const findUCourse = await this.userCourseRepo.find({
      where: {
        courseId: id,
        userId: user.id
      }
    })
    if (findUCourse.length == 1)
      // ) {
      throw new BadRequestException("Người dùng đã đăng kí khóa học này rồi");
    // }

    const course = await this.courseRepo.findOne({ where: { id } });
    if (course === null) {
      throw new NotFoundException('Không tìm thấy khóa học');
    }

    const newUserCourse = this.userCourseRepo.create({
      userId: user.id,
      courseId: id,
      course: course, // Gán đối tượng course
    });
    return this.userCourseRepo.save(newUserCourse);
  }

  updateProgress = async (id: number, userId: number, progress: number) => {
    return await this.userCourseRepo.update({ courseId: id, userId: userId }, { progress })
  }

  async findAll(user: IUser) {
    const Courses = await this.userCourseRepo
      .createQueryBuilder('user_course')
      .leftJoinAndSelect('user_course.course', 'course')
      .where('user_course.userId = :userId', { userId: user.id })
      .getMany()
    return Courses;
  }

  findOne(id: number) {
    return `This action returns a #${id} userCourse`;
  }

  //update progress
  update(id: number, updateUserCourseDto: UpdateUserCourseDto) {
    return `This action updates a #${id} userCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCourse`;
  }
}
