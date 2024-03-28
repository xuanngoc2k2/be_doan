import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserVocabularyDto } from './dto/create-user_vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user_vocabulary.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Vocabulary } from 'src/vocabularys/entities/vocabulary.entity';
import { Repository } from 'typeorm';
import { User_Vocabulary } from './entities/user_vocabulary.entity';
import { User } from 'src/decorator/customize';

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

  async findAll(user: IUser) {
    return await this.userVocabularyRepo.find({ where: { userId: user.id } });
  }

  findOne(id: number, user: IUser) {
    return `This action returns a #${id} userVocabulary`;
  }

  async update(isRemember: number, vocabularyId: number, user: IUser) {
    if (!await this.vocabularyRepo.find({ where: { id: vocabularyId } })) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }
    if (!await this.userVocabularyRepo.find({ where: { vocabularyId: vocabularyId, userId: user.id } })) {
      throw new NotFoundException("Không tìm thấy từ vựng của người dùng");
    }
    const updateUVocab = await this.userVocabularyRepo.update({ userId: user.id, vocabularyId: vocabularyId }, { isRemember });
    if (updateUVocab.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }
    return { success: true };
  }

  async remove(vocabularyId: number, user: IUser) {
    if (!await this.vocabularyRepo.find({ where: { id: vocabularyId } })) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }
    if (!await this.userVocabularyRepo.find({ where: { vocabularyId: vocabularyId, userId: user.id } })) {
      throw new NotFoundException("Không tìm thấy từ vựng của người dùng");
    }
    const deleteUVocab = await this.userVocabularyRepo.softDelete({ userId: user.id, vocabularyId: vocabularyId });
    if (deleteUVocab.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }
    return { success: true };
  }
}
