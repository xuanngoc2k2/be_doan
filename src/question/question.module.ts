import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Group_Question } from 'src/group_question/entities/group_question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Group_Question])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule { }
