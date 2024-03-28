import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserVocabularyDto } from './dto/create-user_vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user_vocabulary.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Vocabulary } from 'src/vocabularys/entities/vocabulary.entity';
import { Repository } from 'typeorm';
import { User_Vocabulary } from './entities/user_vocabulary.entity';

@Injectable()
export class UserVocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
    @InjectRepository(User_Vocabulary)
    private userVocabularyRepo: Repository<User_Vocabulary>
  ) {

  }
  async create(vocabularyId: number, user: IUser) {
    if (!await this.vocabularyRepo.findOne({ where: { id: vocabularyId } })) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }
    const newUVocabulary = await this.userVocabularyRepo.create({ userId: user.id, vocabularyId: vocabularyId });
    //check đã thêm chưa
    return this.userVocabularyRepo.save(newUVocabulary);
  }

  findAll() {
    return `This action returns all userVocabulary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userVocabulary`;
  }

  update(id: number, updateUserVocabularyDto: UpdateUserVocabularyDto) {
    return `This action updates a #${id} userVocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} userVocabulary`;
  }
}
