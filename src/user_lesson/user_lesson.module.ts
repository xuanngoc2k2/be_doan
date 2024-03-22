import { Module } from '@nestjs/common';
import { UserLessonService } from './user_lesson.service';
import { UserLessonController } from './user_lesson.controller';

@Module({
  controllers: [UserLessonController],
  providers: [UserLessonService],
})
export class UserLessonModule {}
