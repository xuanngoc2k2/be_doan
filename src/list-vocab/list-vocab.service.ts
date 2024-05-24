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
import { UserList } from 'src/user_list/entities/user_list.entity';
import { Vocaboflist } from 'src/vocaboflist/entities/vocaboflist.entity';

@Injectable()
export class ListVocabService {
  constructor(
    @InjectRepository(ListVocab)
    private listVobRepo: Repository<ListVocab>,
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
    @InjectRepository(User_Vocabulary)
    private userVocabularyRepo: Repository<User_Vocabulary>,
    @InjectRepository(UserList)
    private userListRepo: Repository<UserList>,
    @InjectRepository(Vocaboflist)
    private vocabOfListRepo: Repository<Vocaboflist>,
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {

  }
  async create(createListVocabDto: CreateListVocabDto, user: IUser) {
    const findUser = await this.userRepo.findOne({ where: { id: user.id } });
    if (!findUser) {
      throw new BadRequestException("Không tìm thấy user");
    }
    if (user.role == 'ADMIN') {
      const newList = await this.listVobRepo.save(await this.listVobRepo.create({ ...createListVocabDto }));
      return newList;
    }
    else {
      const newList = await this.listVobRepo.save(await this.listVobRepo.create({ ...createListVocabDto }));
      const newUList = await this.userListRepo.save(await this.userListRepo.create({ listVocabId: newList.id, userId: user.id }));
      return newUList;
    }
  }

  async copy(idList: number, user: IUser, name?: string, des?: string) {
    const findUser = await this.userRepo.findOne({ where: { id: user.id } });
    if (!findUser) {
      throw new BadRequestException("Không tìm thấy user");
    }
    const findList = await this.listVobRepo
      .createQueryBuilder('list_vocab')
      .leftJoinAndSelect('list_vocab.vocablist', 'vocablist')
      .where('list_vocab.id = :id', { id: idList })
      .getOne();
    const newList = await this.listVobRepo.save(this.listVobRepo.create({
      name: name || findList.name + ' copy',
      description: des || findList.description
    }));

    await this.userListRepo.save(await this.userListRepo.create({ listVocabId: newList.id, userId: user.id }));

    for (const vocab of findList.vocablist) {
      await this.vocabOfListRepo.save(this.vocabOfListRepo.create({
        listVocabId: newList.id,
        vocabularyId: vocab.vocabularyId
      }));
    }

    return newList;
  }

  handleFindList(result: ListVocab[], user?: IUser) {
    const rs = [];
    for (const listVocab of result) {
      const vocabList = listVocab.vocablist;
      let totalWords = vocabList.length;
      let needRemember = 0;
      for (const vocabEntry of vocabList) {
        // Kiểm tra từng userVocab để tính toán đúng cho user hiện tại
        const userVocab = vocabEntry.userVocab.find(userVob => userVob.userId === user.id);
        if (!userVocab || userVocab.isRemember === 0) {
          needRemember += 1;
        }
      }
      rs.push({
        id: listVocab.id,
        name: listVocab.name,
        totalWords,
        needRemember,
        remembered: totalWords - needRemember,
        description: listVocab.description,
        isMine: listVocab.userlist.some((u) => u.userId === user.id),
        createdAt: listVocab.createAt
      });
    }
    return rs;
  }

  // handleFindList(result: ListVocab[], user?: IUser) {
  //   const rs = [];
  //   for (const listVocab of result) {
  //     const vocabList = listVocab.vocablist;
  //     let totalWords = vocabList.length;
  //     let needRemember = 0;
  //     for (const vocabEntry of vocabList) {
  //       // Nếu userVocab rỗng hoặc có userVocab và isRemember bằng 0 thì cần ghi nhớ
  //       if (vocabEntry.userVocab.length === 0 || vocabEntry.userVocab.some(userVob => userVob.isRemember === 0)) {
  //         needRemember += 1;
  //       }
  //     }
  //     rs.push({
  //       id: listVocab.id,
  //       name: listVocab.name,
  //       totalWords,
  //       needRemember,
  //       remembered: totalWords - needRemember,
  //       description: listVocab.description,
  //       isMine: listVocab.userlist.some((u) => u.userId === user.id),
  //       createdAt: listVocab.createAt
  //     });
  //   }
  //   return rs;
  // }

  async findAll(user: IUser, search?: string) {
    const queryBuilder = this.listVobRepo
      .createQueryBuilder('list_vocab')
      .leftJoinAndSelect('list_vocab.userlist', 'userlist')
      .leftJoinAndSelect('list_vocab.vocablist', 'vocablist')
      .leftJoinAndSelect('vocablist.userVocab', 'userVocab')
    if (search) {
      queryBuilder.where('list_vocab.name LIKE :search', { search: `%${search}%` });
    }
    queryBuilder.andWhere('userlist.userId IS NULL OR userlist.userId = :id', { id: user.id });

    const result = await queryBuilder.getMany();
    // return result;
    return this.handleFindList(result, user);
  }


  // async findAll(user: IUser, search: string) {
  //   const queryBuilder = await this.listVobRepo
  //     .createQueryBuilder('list_vocab')
  //     .leftJoinAndSelect('list_vocab.userlist', 'userlist')
  //     .leftJoinAndSelect('list_vocab.vocablist', 'vocablist')
  //     // .leftJoinAndSelect('vocablist.vocabulary', 'vocabulary')
  //     .leftJoinAndSelect('vocablist.userVocab', 'userVocab')
  //     .where('userlist.userId IS NULL OR userlist.userId =:id', { id: user.id })
  //     .andWhere('list_vocab.name LIKE ')
  //   if (search) {
  //     queryBuilder.andWhere('list_vocab.name LIKE :search', { search: `%${search}%` });
  //   }
  //   const result = await queryBuilder.getMany();

  //   return this.handleFindList(result, user);
  //   // return result
  // }

  async findOne(id: number, user: IUser) {
    const result = await this.listVobRepo
      .createQueryBuilder('list_vocab')
      .leftJoinAndSelect('list_vocab.userlist', 'userlist')
      .leftJoinAndSelect('list_vocab.vocablist', 'vocablist')
      .leftJoinAndSelect('vocablist.vocabulary', 'vocabulary')
      .leftJoinAndSelect('vocablist.userVocab', 'userVocab')
      .where('userlist.userId IS NULL OR userlist.userId =:id', { id: user.id })
      .where('list_vocab.id=:id', { id })
      .getOne();
    let totalWords = result.vocablist.length;
    let needRemember = 0;
    const vocabs = [];
    const isMine = result.userlist.some((ul) => ul.userId == user.id);

    for (const vocabEntry of result.vocablist) {
      const userVocab = vocabEntry.userVocab.find(uv => uv.userId === user.id);
      if (!userVocab) {
        await this.userVocabularyRepo.save(
          await this.userVocabularyRepo.create({
            listVocabId: result.id,
            vocabularyId: vocabEntry.vocabularyId,
            isRemember: 0,
            userId: user.id
          }))
      }
      if (!userVocab || userVocab.isRemember === 0) {
        needRemember += 1;
      }
      vocabs.push({
        vocab: vocabEntry.vocabulary,
        isRemember: userVocab ? userVocab.isRemember : 0
      });
    }

    return {
      vocabs,
      name: result.name,
      description: result.description,
      totalWords,
      needRemember,
      isMine
    };
  }

  // getVocabWithCourse = async () => {
  //   return await this.courseRepo
  //     .createQueryBuilder('course')
  //     .innerJoinAndSelect('course.vocabularys', 'vocabulary')
  //     .getMany();
  // }

  async update(id: number, updateListVocabDto: UpdateListVocabDto) {
    const findList = await this.listVobRepo.findOne({ where: { id } })
    if (!findList) {
      throw new BadRequestException("Không tìm thấy List");
    }
    const updateList = await this.listVobRepo.update({ id }, { ...updateListVocabDto })

    if (updateList.affected == 0) {
      throw new BadRequestException("Update lỗi")
    }
    return { success: true };
  }

  async remove(id: number) {
    const deleteList = await this.listVobRepo.softDelete({ id });
    if (deleteList.affected == 0) {
      throw new BadRequestException("Xóa lỗi")
    }
    return { success: true };
  }
}
