import { Module } from '@nestjs/common';
import { ResultDetailService } from './result_detail.service';
import { ResultDetailController } from './result_detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result_Detail } from './entities/result_detail.entity';
import { Question } from 'src/question/entities/question.entity';
import { Result } from 'src/result/entities/result.entity';
import { QuestionService } from 'src/question/question.service';
import { QuestionModule } from 'src/question/question.module';
import { AnswerModule } from 'src/answer/answer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Result_Detail, Question, Result]), AnswerModule],
  controllers: [ResultDetailController],
  providers: [ResultDetailService],
  exports: [ResultDetailService]
})
export class ResultDetailModule { }
