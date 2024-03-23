import { Injectable } from '@nestjs/common';
import { CreateTypeQuestionDto } from './dto/create-type_question.dto';
import { UpdateTypeQuestionDto } from './dto/update-type_question.dto';

@Injectable()
export class TypeQuestionService {
  create(createTypeQuestionDto: CreateTypeQuestionDto) {
    return 'This action adds a new typeQuestion';
  }

  findAll() {
    return `This action returns all typeQuestion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typeQuestion`;
  }

  update(id: number, updateTypeQuestionDto: UpdateTypeQuestionDto) {
    return `This action updates a #${id} typeQuestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} typeQuestion`;
  }
}
