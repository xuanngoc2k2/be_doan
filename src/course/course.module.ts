import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UserCourseModule } from 'src/user_course/user_course.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), UserCourseModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }
