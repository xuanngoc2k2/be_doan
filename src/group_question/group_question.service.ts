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
    return await this.groupQuestionRepo.find({});
  }

  async findOne(id: number) {
    return await this.groupQuestionRepo.find({ where: { id } });
  }

  async update(id: number, updateGroupQuestionDto: UpdateGroupQuestionDto) {
    if (!await this.groupQuestionRepo.find({ where: { id } })) {
      throw new BadRequestException("Không tìm thấy group question");
    }
    const updateGQuestion = await this.groupQuestionRepo.update({ id }, { ...updateGroupQuestionDto });
    if (updateGQuestion.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }
    return { success: true };
  }

  async remove(id: number) {
    if (!await this.groupQuestionRepo.find({ where: { id } })) {
      throw new BadRequestException("Không tìm thấy group question");
    }
    const deleteGQuestion = await this.groupQuestionRepo.softDelete({ id });
    if (deleteGQuestion.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }
    return { success: true };
  }
}
