import { Injectable } from '@nestjs/common';
import { CreateVocaboflistDto } from './dto/create-vocaboflist.dto';
import { UpdateVocaboflistDto } from './dto/update-vocaboflist.dto';

@Injectable()
export class VocaboflistService {
  create(createVocaboflistDto: CreateVocaboflistDto) {
    return 'This action adds a new vocaboflist';
  }

  findAll() {
    return `This action returns all vocaboflist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocaboflist`;
  }

  update(id: number, updateVocaboflistDto: UpdateVocaboflistDto) {
    return `This action updates a #${id} vocaboflist`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocaboflist`;
  }
}
