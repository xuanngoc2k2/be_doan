import { Module } from '@nestjs/common';
import { GroupQuestionService } from './group_question.service';
import { GroupQuestionController } from './group_question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group_Question } from './entities/group_question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group_Question])],
  controllers: [GroupQuestionController],
  providers: [GroupQuestionService],
})
export class GroupQuestionModule { }
