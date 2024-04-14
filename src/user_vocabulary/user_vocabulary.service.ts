import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserVocabularyDto } from './dto/create-user_vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user_vocabulary.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Vocabulary } from 'src/vocabularys/entities/vocabulary.entity';
import { Repository } from 'typeorm';
import { User_Vocabulary } from './entities/user_vocabulary.entity';
import { User } from 'src/decorator/customize';
import { VocabularysService } from 'src/vocabularys/vocabularys.service';
import { CreateVocabularyDto } from 'src/vocabularys/dto/create-vocabulary.dto';

@Injectable()
export class UserVocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
    @InjectRepository(User_Vocabulary)
    private userVocabularyRepo: Repository<User_Vocabulary>,
    private vocabSevice: VocabularysService
  ) {

  }
  async create(idList: number, vocabulary: CreateVocabularyDto, user: IUser) {
    const newVocab = await this.vocabSevice.create(vocabulary);
    console.log(vocabulary)
    const newListVob = await this.userVocabularyRepo.create({ isRemember: 0, listVobId: idList, vocabularyId: newVocab.id, vocabulary: newVocab })
    // check đã thêm chưa
    return await this.userVocabularyRepo.save(newListVob);
  }

  async findAll(user: IUser) {
    // return await this.userVocabularyRepo.find({ where: { userId: user.id } });
  }

  findOne(id: number, user: IUser) {
    return `This action returns a #${id} userVocabulary`;
  }

  async update(isRemember: number, vocabularyId: number, user: IUser) {
    // if (!await this.vocabularyRepo.find({ where: { id: vocabularyId } })) {
    //   throw new NotFoundException("Không tìm thấy từ vựng");
    // }
    // if (!await this.userVocabularyRepo.find({ where: { vocabularyId: vocabularyId, userId: user.id } })) {
    //   throw new NotFoundException("Không tìm thấy từ vựng của người dùng");
    // }
    // const updateUVocab = await this.userVocabularyRepo.update({ userId: user.id, vocabularyId: vocabularyId }, { isRemember });
    // if (updateUVocab.affected === 0) {
    //   throw new BadRequestException("Update lỗi");
    // }
    return { success: true };
  }

  async updateRemember(vocabularyId: number, listId: number): Promise<{ success: boolean }> {
    const vocabulary = await this.vocabularyRepo.findOne({ where: { id: vocabularyId } });
    if (!vocabulary) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }

    const userVocabulary = await this.userVocabularyRepo.findOne({ where: { listVobId: listId, vocabularyId: vocabularyId } });
    if (!userVocabulary) {
      throw new NotFoundException("Không tìm thấy từ vựng của người dùng");
    }

    const newIsRemember = userVocabulary.isRemember === 0 ? 1 : 0;
    await this.userVocabularyRepo.update({ listVobId: listId, vocabularyId: vocabularyId }, { isRemember: newIsRemember });

    return { success: true };
  }

  async remove(vocabularyId: number, listId: number) {
    if (!await this.vocabularyRepo.find({ where: { id: vocabularyId } })) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }
    // if (!await this.userVocabularyRepo.find({ where: { vocabularyId: vocabularyId, userId: user.id } })) {
    //   throw new NotFoundException("Không tìm thấy từ vựng của người dùng");
    // }
    const deleteUVocab = await this.userVocabularyRepo.softDelete({ listVobId: listId, vocabularyId: vocabularyId });
    if (deleteUVocab.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }
    return { success: true };
  }
}
