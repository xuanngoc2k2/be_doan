import { Injectable } from '@nestjs/common';
import { CreateExamQuestionDto } from './dto/create-examquestion.dto';
import { UpdateExamQuestionDto } from './dto/update-examquestion.dto';

@Injectable()
export class ExamQuestionService {
  create(createExamquestionDto: CreateExamQuestionDto) {
    return 'This action adds a new examquestion';
  }

  findAll() {
    return `This action returns all examquestion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examquestion`;
  }

  update(id: number, updateExamquestionDto: UpdateExamQuestionDto) {
    return `This action updates a #${id} examquestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} examquestion`;
  }
}
