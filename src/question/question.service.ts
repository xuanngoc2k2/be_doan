import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { Group_Question } from 'src/group_question/entities/group_question.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(Group_Question)
    private groupQuestion: Repository<Group_Question>
  ) { }
  async create(createQuestionDto: CreateQuestionDto) {
    let groupQuestion = null;
    if (createQuestionDto?.group_questionId) {
      if (!await this.groupQuestion.findOne({ where: { id: createQuestionDto.group_questionId } })) {
        throw new NotFoundException("Không tìm thấy group question");
      }
      groupQuestion = await this.groupQuestion.findOne({ where: { id: createQuestionDto.group_questionId } })
    }
    const newQuestion = await this.questionRepo.create({ ...createQuestionDto, group_question: groupQuestion });
    return await this.questionRepo.save(newQuestion);
  }

  async findAll() {
    return await this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.group_question', 'group_question')
      .getMany();
  }

  async findOne(id: number) {
    return await this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.group_question', 'group_question')
      .where('question.id = :id', { id: id })
      .andWhere('question.delete_at IS NULL')
      .getOne();
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepo.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException("Không tìm thấy question");
    }
    const { group_questionId, ...updateQuestionDTo } = updateQuestionDto;

    // Kiểm tra và lấy thông tin của group question nếu có
    let groupQuestion = null;
    if (group_questionId) {
      groupQuestion = await this.groupQuestion.findOne({ where: { id: group_questionId } });
      if (!groupQuestion) {
        throw new NotFoundException("Không tìm thấy group question");
      }
    }

    // Thực hiện cập nhật câu hỏi
    const updateResult = await this.questionRepo.update(id, { ...updateQuestionDTo, group_question: groupQuestion });

    // Kiểm tra kết quả cập nhật
    if (updateResult.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }

    return { success: true };
  }

  async remove(id: number) {

    const question = await this.questionRepo.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException("Không tìm thấy question");
    }

    // Thực hiện cập nhật câu hỏi
    const deleteResult = await this.questionRepo.softDelete({ id });

    // Kiểm tra kết quả cập nhật
    if (deleteResult.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }

    return { success: true };
  }
}
