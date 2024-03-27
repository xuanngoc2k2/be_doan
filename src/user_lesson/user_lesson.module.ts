import { Module } from '@nestjs/common';
import { UserLessonService } from './user_lesson.service';
import { UserLessonController } from './user_lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { User_Lesson } from './entities/user_lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, User_Lesson])],
  controllers: [UserLessonController],
  providers: [UserLessonService],
})
export class UserLessonModule { }
