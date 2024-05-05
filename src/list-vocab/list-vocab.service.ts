import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListVocabDto } from './dto/create-list-vocab.dto';
import { UpdateListVocabDto } from './dto/update-list-vocab.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListVocab } from './entities/list-vocab.entity';
import { User_Vocabulary } from 'src/user_vocabulary/entities/user_vocabulary.entity';
import { Vocabulary } from 'src/vocabularys/entities/vocabulary.entity';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';

@Injectable()
export class ListVocabService {
  constructor(
    @InjectRepository(ListVocab)
    private listVobRepo: Repository<ListVocab>,
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {

  }
  async create(createListVocabDto: CreateListVocabDto, user: IUser) {
    const findUser = await this.userRepo.findOne({ where: { id: user.id } });
    if (!findUser) {
      throw new BadRequestException("Không tìm thấy user");
    }
    const newList = await this.listVobRepo.create({ ...createListVocabDto, user: findUser })
    return await this.listVobRepo.save(newList);
  }

  handleFindList(result: ListVocab[]) {
    const rs = [];
    for (const listVocab of result) {
      const userVob = listVocab.userVob
      let totalWords = 0;
      let needRemember = 0;
      for (const key in userVob) {
        totalWords += 1;
        if (userVob[key]['isRemember'] == 0) needRemember += 1
      }
      listVocab.description
      rs.push({
        id: listVocab.id,
        name: listVocab.name,
        totalWords,
        needRemember,
        remembered: totalWords - needRemember,
        description: listVocab.description
      })
    }
    return rs;
  }
  async findAll(user: IUser) {
    const result = await this.listVobRepo
      .createQueryBuilder('list_vocab')
      .leftJoinAndSelect('list_vocab.user', 'user')
      .leftJoinAndSelect('list_vocab.userVob', 'userVob')
      .leftJoinAndSelect('userVob.vocabulary', 'vocabulary')
      .where('user.id =:id', { id: user.id })
      .getMany();
    // return result
    return this.handleFindList(result);
  }

  async findOne(id: number, user: IUser) {
    const result = await this.listVobRepo
      .createQueryBuilder('list_vocab')
      .leftJoinAndSelect('list_vocab.userVob', 'userVob')
      .leftJoinAndSelect('userVob.vocabulary', 'vocabulary')
      .where('list_vocab.id=:id', { id })
      .getOne()
    const userVob = result.userVob
    let totalWords = 0;
    let needRemember = 0;
    const vocabs = [];
    for (const key in userVob) {
      totalWords += 1;
      if (userVob[key]['isRemember'] == 0) needRemember += 1
      vocabs.push({ vocab: userVob[key]['vocabulary'], isRemember: userVob[key]['isRemember'] })
    }

    return {
      vocabs,
      name: result.name,
      description: result.description,
      totalWords, needRemember
    };
  }

  getVocabWithCourse = async () => {
    return await this.courseRepo
      .createQueryBuilder('course')
      .innerJoinAndSelect('course.vocabularys', 'vocabulary')
      .getMany();
  }

  update(id: number, updateListVocabDto: UpdateListVocabDto) {
    return `This action updates a #${id} listVocab`;
  }

  remove(id: number) {
    return `This action removes a #${id} listVocab`;
  }
}
