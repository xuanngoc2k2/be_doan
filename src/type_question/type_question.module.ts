import { Module } from '@nestjs/common';
import { TypeQuestionService } from './type_question.service';
import { TypeQuestionController } from './type_question.controller';

@Module({
  controllers: [TypeQuestionController],
  providers: [TypeQuestionService],
})
export class TypeQuestionModule {}
