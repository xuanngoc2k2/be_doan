import { Module } from '@nestjs/common';
import { UserCourseService } from './user_course.service';
import { UserCourseController } from './user_course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User_Course } from './entities/user_course.entity';
import { Course } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User_Course, Course])],
  controllers: [UserCourseController],
  providers: [UserCourseService],
  exports: [UserCourseService]
})
export class UserCourseModule { }
