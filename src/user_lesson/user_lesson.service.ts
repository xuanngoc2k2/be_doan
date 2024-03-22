import { Injectable } from '@nestjs/common';
import { CreateUserLessonDto } from './dto/create-user_lesson.dto';
import { UpdateUserLessonDto } from './dto/update-user_lesson.dto';

@Injectable()
export class UserLessonService {
  create(createUserLessonDto: CreateUserLessonDto) {
    return 'This action adds a new userLesson';
  }

  findAll() {
    return `This action returns all userLesson`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userLesson`;
  }

  update(id: number, updateUserLessonDto: UpdateUserLessonDto) {
    return `This action updates a #${id} userLesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} userLesson`;
  }
}
