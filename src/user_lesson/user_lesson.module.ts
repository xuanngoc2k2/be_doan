import { Module } from '@nestjs/common';
import { UserLessonService } from './user_lesson.service';
import { UserLessonController } from './user_lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { User_Lesson } from './entities/user_lesson.entity';
import { UserCourseModule } from 'src/user_course/user_course.module';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { CourseModule } from 'src/course/course.module';
import { LessonService } from 'src/lesson/lesson.service';
import { LessonModule } from 'src/lesson/lesson.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, User_Lesson]), UserCourseModule, UsersModule, CourseModule, LessonModule],
  controllers: [UserLessonController],
  providers: [UserLessonService],
})
export class UserLessonModule { }
