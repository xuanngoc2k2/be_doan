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

  async findAll(user: IUser) {
    return this.userLessonRepo.find({ where: { userId: user.id } });
  }

  findOne(id: number) {
    return `This action returns a #${id} userLesson`;
  }

  async update(id: number, user: IUser) {
    const userLesson = await this.userLessonRepo.findOne({
      where: {
        userId: user.id,
        lessonId: id
      }
    });
    if (!userLesson) {
      throw new Error('Không tìm thấy User_Lesson');
    }
    if (userLesson.isComplete) {
      throw new BadRequestException("Bài học đã hoàn thành");
    }
    userLesson.isComplete = true;
    userLesson.completeAt = new Date();
    return this.userLessonRepo.save(userLesson);
  }
  updateTime = async (id: number, time: string, user: IUser) => {
    const userLesson = await this.userLessonRepo.findOne({
      where: {
        userId: user.id,
        lessonId: id
      }
    });
    if (!userLesson) {
      throw new Error('Không tìm thấy User_Lesson');
    }
    if (userLesson.isComplete) {
      throw new BadRequestException("Bài học đã hoàn thành");
    }
    userLesson.currentTime = time;
    const updateUL = await this.userLessonRepo.update({ lessonId: id, userId: user.id }, { ...userLesson });
    if (updateUL.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }
    return { success: true };
  }
  remove(id: number) {
    return `This action removes a #${id} userLesson`;
  }
}
