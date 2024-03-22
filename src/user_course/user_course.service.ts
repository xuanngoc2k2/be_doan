import { Injectable } from '@nestjs/common';
import { CreateUserCourseDto } from './dto/create-user_course.dto';
import { UpdateUserCourseDto } from './dto/update-user_course.dto';

@Injectable()
export class UserCourseService {
  create(createUserCourseDto: CreateUserCourseDto) {
    return 'This action adds a new userCourse';
  }

  findAll() {
    return `This action returns all userCourse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userCourse`;
  }

  update(id: number, updateUserCourseDto: UpdateUserCourseDto) {
    return `This action updates a #${id} userCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCourse`;
  }
}
