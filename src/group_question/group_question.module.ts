import { Module } from '@nestjs/common';
import { GroupQuestionService } from './group_question.service';
import { GroupQuestionController } from './group_question.controller';

@Module({
  controllers: [GroupQuestionController],
  providers: [GroupQuestionService],
})
export class GroupQuestionModule {}
