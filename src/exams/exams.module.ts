import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { GroupQuestionService } from 'src/group_question/group_question.service';
// import { ExamGrquestion } from 'src/exam-grquestion/entities/exam-grquestion.entity';
import { ExamQuestion } from 'src/examquestion/entities/examquestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamQuestion])],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule { }
