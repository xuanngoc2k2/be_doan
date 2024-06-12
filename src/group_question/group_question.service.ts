import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupQuestionDto } from './dto/create-group_question.dto';
import { UpdateGroupQuestionDto } from './dto/update-group_question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group_Question } from './entities/group_question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupQuestionService {
  constructor(
    @InjectRepository(Group_Question)
    private groupQuestionRepo: Repository<Group_Question>
  ) {
  }
  async create(createGroupQuestionDto: CreateGroupQuestionDto) {
    const newGroupQuestion = this.groupQuestionRepo.create({ ...createGroupQuestionDto });
    return await this.groupQuestionRepo.save(newGroupQuestion);
  }

  async findAll() {
    return await this.groupQuestionRepo
      .createQueryBuilder('group-question')
      .leftJoinAndSelect('group-question.questions', 'question')
      .leftJoinAndSelect('question.answers', 'answer')
      .getMany();
  }

  async findOne(id: number) {
    return await this.groupQuestionRepo.find({ where: { id } });
  }

  async findQuestion(id: number) {
    return await this.groupQuestionRepo
      .createQueryBuilder('group_question')
      .innerJoinAndSelect('group_question.questions', 'question')
      .innerJoinAndSelect('question.answers', 'answer')
      .where('group_question.id = :id', { id })
      .getOne();
  }

  async findQuestionById(idGroup: number, idQuestion) {
    return await this.groupQuestionRepo
      .createQueryBuilder('group_question')
      .innerJoinAndSelect('group_question.questions', 'question')
      .innerJoinAndSelect('question.answers', 'answer')
      .where('group_question.id = :id and question.id = :idQ', { id: idGroup, idQ: idQuestion })
      .select(['group_question', 'question', 'answer.id', 'answer.answer', 'answer.isImage'])
      .getOne();
  }

  async update(id: number, updateGroupQuestionDto: UpdateGroupQuestionDto) {
    if (!await this.groupQuestionRepo.findOne({ where: { id } })) {
      throw new BadRequestException("Không tìm thấy group question");
    }
    const { questions, ...update } = updateGroupQuestionDto;
    const updateGQuestion = await this.groupQuestionRepo.update({ id }, { ...update });
    if (updateGQuestion.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }
    return { success: true };
  }

  async remove(id: number) {
    if (!await this.groupQuestionRepo.findOne({ where: { id } })) {
      throw new BadRequestException("Không tìm thấy group question");
    }
    const deleteGQuestion = await this.groupQuestionRepo.softDelete({ id });
    if (deleteGQuestion.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }
    return { success: true };
  }

  countQuestion = async (groupQuestionId) => {
    console.log(groupQuestionId)
    // const countQues = await this.groupQuestionRepo
    //   .createQueryBuilder('group_question')
    //   .innerJoinAndSelect('group_question.questions', 'question')
    //   .getMany()
    // return countQues;
  }
}
