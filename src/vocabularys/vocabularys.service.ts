import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { Repository } from 'typeorm';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Injectable()
export class VocabularysService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>
  ) { }

  async create(createVocabularyDto: CreateVocabularyDto) {
    let lesson = null;
    if (createVocabularyDto.lessonId) {
      lesson = await this.lessonRepo.findOne({ where: { id: createVocabularyDto.lessonId } })
    }
    const newVocabulary = await this.vocabularyRepo.create({ ...createVocabularyDto, lesson });
    return await this.vocabularyRepo.save(newVocabulary);
  }

  async findAll() {
    return await this.vocabularyRepo.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabulary`;
  }

  async update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    const existingVocabulary = await this.vocabularyRepo.findOne({ where: { id } });
    if (!existingVocabulary) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }

    const { lessonId, ...updateVc } = updateVocabularyDto;
    let lesson = null;
    if (updateVocabularyDto.lessonId) {
      lesson = await this.lessonRepo.findOne({ where: { id: updateVocabularyDto.lessonId } });
      if (!lesson) {
        throw new NotFoundException("Không tìm thấy bài học");
      }
    }
    const updateWord = await this.vocabularyRepo.update({ id }, { ...updateVc, lesson });
    if (updateWord.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }
    return { success: true };
  }

  async remove(id: number) {
    if (!await this.vocabularyRepo.findOne({ where: { id } })) {
      throw new NotFoundException("Không thấy Word");
    }
    const updateWord = await this.vocabularyRepo.softDelete({ id });
    if (updateWord.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }
    return { success: true };
  }
}
