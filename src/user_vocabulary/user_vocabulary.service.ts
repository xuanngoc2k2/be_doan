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
import { Vocaboflist } from 'src/vocaboflist/entities/vocaboflist.entity';
@Injectable()
export class UserVocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
    @InjectRepository(User_Vocabulary)
    private userVocabularyRepo: Repository<User_Vocabulary>,
    @InjectRepository(Vocaboflist)
    private vocaboflistRepo: Repository<Vocaboflist>,
    private vocabSevice: VocabularysService
  ) {

  }
  async create(idList: number, vocabulary: CreateVocabularyDto, user: IUser) {
    // const findList = await this.
    const newVocab = await this.vocabSevice.create(vocabulary);
    await this.vocaboflistRepo.save(await this.vocaboflistRepo.create({ vocabularyId: newVocab.id, listVocabId: idList }));
    const newListVob = await this.userVocabularyRepo.create({ isRemember: 0, listVocabId: idList, vocabularyId: newVocab.id, userId: user.id })
    // check đã thêm chưa
    return await this.userVocabularyRepo.save(newListVob);
  }

  async findAll(user: IUser) {
    // return await this.userVocabularyRepo.find({ where: { userId: user.id } });
  }

  findOne(id: number, user: IUser) {
    return `This action returns a #${id} userVocabulary`;
  }

  async update(isRemember: number, listId: number, vocabularyId: number, user: IUser) {
    if (!await this.vocabularyRepo.find({ where: { id: vocabularyId } })) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }
    if (!await this.userVocabularyRepo.find({ where: { vocabularyId: vocabularyId, userId: user.id, listVocabId: listId } })) {
      throw new NotFoundException("Không tìm thấy từ vựng của người dùng");
    }
    const updateUVocab = await this.userVocabularyRepo.update({ userId: user.id, vocabularyId: vocabularyId, listVocabId: listId }, { isRemember });
    if (updateUVocab.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }
    return { success: true };
  }

  async updateRemember(vocabularyId: number, listId: number, user: IUser): Promise<{ success: boolean }> {
    const vocabulary = await this.vocabularyRepo.findOne({ where: { id: vocabularyId } });
    if (!vocabulary) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }
    const userVocabulary = await this.userVocabularyRepo.findOne({ where: { listVocabId: listId, vocabularyId: vocabulary.id, userId: user.id } });
    if (!userVocabulary) {
      throw new NotFoundException("Không tìm thấy từ vựng của người dùng");
    }
    const newIsRemember = userVocabulary.isRemember === 0 ? 1 : 0;
    await this.userVocabularyRepo.update({ listVocabId: listId, vocabularyId: vocabularyId, userId: user.id }, { isRemember: newIsRemember });

    return { success: true };
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }


  // Chọn ngẫu nhiên 3 nghĩa từ danh sách và lưu thành listQuestion
  renderQuestion = async (listId: number) => {
    const listVob = await this.vocaboflistRepo
      .createQueryBuilder('vocaboflist')
      .leftJoinAndSelect('vocaboflist.vocabulary', 'vocabulary') // Đổi 'vocaboflist.vocabularyId' thành 'vocaboflist.vocabulary'
      .where('vocaboflist.listVocabId = :id', { id: listId })
      .select(['vocaboflist', 'vocabulary.id', 'vocabulary.word', 'vocabulary.meaning', 'vocabulary.partOfSpeech', 'vocabulary.spell'])
      .getMany();

    const questions = [];
    listVob.forEach((t) => {
      const { word, ...meaning } = t.vocabulary; // Sửa 't' thành 't.vocabulary'
      let ans = [word];

      // Tạo một mảng chứa các ý nghĩa ngoại trừ meaning
      const otherMeanings = listVob.filter(vobs => vobs.vocabulary.word !== word).map(vobs => vobs.vocabulary.word); // Sửa 'vobs.word' thành 'vobs.vocabulary.word'

      // Xáo trộn mảng otherMeanings
      this.shuffleArray(otherMeanings);

      // Lấy 3 ý nghĩa ngẫu nhiên từ otherMeanings
      ans = ans.concat(otherMeanings.slice(0, 3));

      // Xáo trộn mảng ans
      this.shuffleArray(ans);

      questions.push({
        meaning,
        ans,
        answer: '',
      });
    });
    return { questions };
  }


  async remove(vocabularyId: number, listId: number, user: IUser) {
    if (!await this.vocabularyRepo.find({ where: { id: vocabularyId } })) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }
    if (!await this.userVocabularyRepo.find({ where: { vocabularyId: vocabularyId, userId: user.id, listVocabId: listId } })) {
      throw new NotFoundException("Không tìm thấy từ vựng của người dùng");
    }
    if (user.role == 'ADMIN') {
      const deleteUVocab = await this.userVocabularyRepo.softDelete({ listVocabId: listId, vocabularyId: vocabularyId });
    }
    else {
      const deleteUVocab = await this.userVocabularyRepo.softDelete({ listVocabId: listId, vocabularyId: vocabularyId, userId: user.id });
    }
    const deleteVocabOfList = await this.vocaboflistRepo.delete({ listVocabId: listId, vocabularyId: vocabularyId });
    if (deleteVocabOfList.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }

    return { success: true };
  }
}
