import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Answer, CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { Repository } from 'typeorm';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Course } from 'src/course/entities/course.entity';
import { Vocaboflist } from 'src/vocaboflist/entities/vocaboflist.entity';

@Injectable()
export class VocabularysService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
    @InjectRepository(Vocaboflist)
    private vocabofListRepo: Repository<Vocaboflist>
  ) { }

  async create(createVocabularyDto: CreateVocabularyDto, idList?: number) {
    const newVocabulary = await this.vocabularyRepo.save(await this.vocabularyRepo.create({ ...createVocabularyDto }));
    if (idList) {
      await this.vocabofListRepo.save(await this.vocabofListRepo.create({ listVocabId: idList, vocabularyId: newVocabulary.id }))
    }
    return newVocabulary;
  }

  search = async (search: string) => {
    const rs = await this.vocabularyRepo.createQueryBuilder('vocabulary')
    if (search) {
      return await rs.where('vocabulary.word LIKE :word', { word: `%${search}%` }).getOne();
    }
  }

  async findAll(id?: number, word?: string, meaning?: string, level?: string[], listId?: number) {
    const rs = await this.vocabularyRepo.createQueryBuilder('vocabulary')
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
    if (listId) {
      rs.leftJoinAndSelect('vocabulary.vocablist', 'vocablist')
        .andWhere('vocablist.listVocabId = :id', { id: listId })
    }
    return await rs.getMany();
  }


  async findAllNotOfList(id?: number, word?: string, meaning?: string, level?: string[], listId?: number) {
    const rs = await this.vocabularyRepo.createQueryBuilder('vocabulary')
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
    if (listId) {
      rs.andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('vocaboflist.vocabularyId')
          .from('vocaboflist', 'vocaboflist')
          .where('vocaboflist.listVocabId = :listId')
          .getQuery();
        return `vocabulary.id NOT IN ${subQuery}`;
      }).setParameter('listId', listId);
    }
    return await rs.getMany();
  }

  async addVocabOfList(listVocab: Vocabulary[], listId: number) {
    const newListVocabOfList = [];
    for (const vocab of listVocab) {
      const newVocabOfList = await this.vocabofListRepo.save(this.vocabofListRepo.create({ vocabularyId: vocab.id, listVocabId: listId }));
      newListVocabOfList.push(newVocabOfList);
    }
    return newListVocabOfList;
  }

  async findOne(id: number) {
    return await this.vocabularyRepo.createQueryBuilder('vocabulary')
      .where('vocabulary.id = :id', { id }).getOne();
  }

  async update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    const existingVocabulary = await this.vocabularyRepo.findOne({ where: { id } });
    if (!existingVocabulary) {
      throw new NotFoundException("Không tìm thấy từ vựng");
    }

    // const { courseId, ...updateVc } = updateVocabularyDto;
    // let course = null;
    // if (updateVocabularyDto.courseId) {
    //   course = await this.courseRepo.findOne({ where: { id: updateVocabularyDto.courseId } });
    //   if (!course) {
    //     throw new NotFoundException("Không tìm thấy bài học");
    //   }
    // }
    const updateWord = await this.vocabularyRepo.update({ id }, { ...updateVocabularyDto });
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

  // getVocabByIdCourse = async (id?: number) => {
  //   const rs = await this.courseRepo.createQueryBuilder('course')
  //     .leftJoinAndSelect('course.vocabularys', 'vocabulary')
  //     .getMany();
  //   const result = [];
  //   rs.map((course) => {
  //     const { vocabularys, ...rss } = course;
  //     if (vocabularys.length) {
  //       result.push({ ...rss, name: rss.course_name, totalWords: vocabularys.length })
  //     }
  //   })
  //   return result;
  // }
}
