import { Module } from '@nestjs/common';
import { UserCourseService } from './user_course.service';
import { UserCourseController } from './user_course.controller';

@Module({
  controllers: [UserCourseController],
  providers: [UserCourseService],
})
export class UserCourseModule {}
