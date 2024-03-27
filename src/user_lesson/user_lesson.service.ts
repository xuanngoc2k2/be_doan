import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserLessonDto } from './dto/update-user_lesson.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Repository } from 'typeorm';
import { User_Lesson } from './entities/user_lesson.entity';

@Injectable()
export class UserLessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
    @InjectRepository(User_Lesson)
    private userLessonRepo: Repository<User_Lesson>
  ) { }
  async create(id: number, user: IUser) {
    if (Number.isNaN(id)) {
      throw new BadRequestException("Id phải là số");
    }
    const Lesson = await this.lessonRepo.findOne({ where: { id } });
    if (Lesson === null) {
      throw new NotFoundException("Không tìm thấy bài học");
    }
    const newUserLesson = this.userLessonRepo.create({
      lessonId: id,
      userId: user.id,
      lesson: Lesson,
    });
    return await this.userLessonRepo.save(newUserLesson);
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
