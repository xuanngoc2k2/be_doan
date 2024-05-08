import { Module } from '@nestjs/common';
import { ExamQuestionService } from './examquestion.service';
import { ExamQuestionController } from './examquestion.controller';

@Module({
  controllers: [ExamQuestionController],
  providers: [ExamQuestionService],
})
export class ExamQuestionModule { }
