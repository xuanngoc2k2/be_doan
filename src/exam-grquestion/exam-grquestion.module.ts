import { Module } from '@nestjs/common';
import { ExamGrquestionService } from './exam-grquestion.service';
import { ExamGrquestionController } from './exam-grquestion.controller';

@Module({
  controllers: [ExamGrquestionController],
  providers: [ExamGrquestionService],
})
export class ExamGrquestionModule {}
