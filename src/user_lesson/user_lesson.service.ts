import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserLessonDto } from './dto/update-user_lesson.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { In, Repository } from 'typeorm';
import { User_Lesson } from './entities/user_lesson.entity';
import { UserCourseService } from 'src/user_course/user_course.service';

@Injectable()
export class UserLessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
    @InjectRepository(User_Lesson)
    private userLessonRepo: Repository<User_Lesson>,
    private userCourseService: UserCourseService
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

  findOne(id: number, user: IUser) {
    return this.userLessonRepo.findOne({ where: { userId: user.id, lessonId: id } });;
  }

  async update(id: number, user: IUser) {
    let userLesson = await this.userLessonRepo.findOne({
      where: {
        userId: user.id,
        lessonId: id
      }
    });
    if (!userLesson) {
      userLesson = await this.userLessonRepo.create({ lessonId: id, user });
      await this.userLessonRepo.save(userLesson)
    }
    if (userLesson.isComplete) {
      throw new BadRequestException("Bài học đã hoàn thành");
    }
    userLesson.isComplete = true;
    userLesson.completeAt = new Date();
    const idCourse = await this.userLessonRepo
      .createQueryBuilder('user_lesson')
      .leftJoinAndSelect('user_lesson.lesson', 'lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .where('lesson.id =:id', { id }).getOne();
    const totalLessons = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .where('course.id=:id', { id: idCourse.lesson.course.id })
      .getMany();

    // Đếm số lượng bài học đã hoàn thành của người dùng
    const completedLessons = await this.userLessonRepo
      .createQueryBuilder('user_lesson')
      .leftJoinAndSelect('user_lesson.lesson', 'lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .where('course.id =:id and user_lesson.isComplete=1', { id: idCourse.lesson.course.id })
      .getMany();

    // Tính toán tiến độ
    const progress = Number(((completedLessons.length + 1) / totalLessons.length) * 100).toFixed(2);
    await this.userCourseService.updateProgress(idCourse.lesson.course.id, user.id, Number(progress));
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