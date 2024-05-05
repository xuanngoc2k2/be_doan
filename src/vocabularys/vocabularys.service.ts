import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Answer, CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { Repository } from 'typeorm';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Course } from 'src/course/entities/course.entity';

@Injectable()
export class VocabularysService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>
  ) { }

  async create(createVocabularyDto: CreateVocabularyDto) {
    let course = null;
    if (createVocabularyDto.courseId) {
      course = await this.courseRepo.findOne({ where: { id: createVocabularyDto.courseId } })
    }
    const newVocabulary = await this.vocabularyRepo.create({ ...createVocabularyDto, course });
    return await this.vocabularyRepo.save(newVocabulary);
  }

  async findAll(id?: number, word?: string, meaning?: string, level?: string[]) {
    const rs = await this.vocabularyRepo.createQueryBuilder('vocabulary')
      .leftJoinAndSelect('vocabulary.course', 'course')
    if (id) {
      rs.where('course.id = :id', { id })
    }
    if (word) {
      rs.andWhere("vocabulary.word LIKE :word", { word: `%${word}%` });
    }
    if (meaning) {
      rs.andWhere("vocabulary.meaning LIKE :meaning", { meaning: `%${meaning}%` });
    }
    if (level) {
      rs.andWhere("vocabulary.level IN (:...level)", { level });
    }
    return await rs.getMany();
  }

  async findOne(id: number) {
    return await this.vocabularyRepo.createQueryBuilder('vocabulary')
      .leftJoinAndSelect('vocabulary.course', 'course')
      .where('vocabulary.id = :id', { id }).getOne();
  }

  async update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    const existingVocabulary = await this.vocabularyRepo.findOne({ where: { id } });
    if (!existingVocabulary) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }

    const { courseId, ...updateVc } = updateVocabularyDto;
    let course = null;
    if (updateVocabularyDto.courseId) {
      course = await this.courseRepo.findOne({ where: { id: updateVocabularyDto.courseId } });
      if (!course) {
        throw new NotFoundException("Không tìm thấy bài học");
      }
    }
    const updateWord = await this.vocabularyRepo.update({ id }, { ...updateVc, course });
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

  checkAnswer = async (listAnswer: Answer[]) => {
    const result = await Promise.all(listAnswer.map(async (answer) => {
      const isMean = await this.vocabularyRepo.findOne({ where: { id: answer.meaning.id } });
      return { ...answer, anTrue: isMean.word };
    }));
    return result;
  }

}
