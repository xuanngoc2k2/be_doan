import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepo: Repository<Answer>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) { }
  async create(createAnswerDto: CreateAnswerDto) {
    const question = await this.questionRepo.findOne({ where: { id: createAnswerDto.questionId } });
    const answers = await this.answerRepo.createQueryBuilder('answer')
      .innerJoin('answer.question', 'question').where('question.id=:id', { id: createAnswerDto.questionId }).getMany()
    if (answers.some((answer) => answer.is_true === true) && createAnswerDto.is_true) {
      throw new BadRequestException("Câu hỏi chỉ có 1 đáp án đúng");
    }
    if (!question) {
      throw new NotFoundException("Không tìm thấy câu hỏi");
    }
    const newAnswer = await this.answerRepo.create({ ...createAnswerDto, is_true: createAnswerDto.is_true ? true : false, question: question });
    return await this.answerRepo.save(newAnswer);
  }

  findAll() {
    return `This action returns all answer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} answer`;
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return `This action updates a #${id} answer`;
  }

  remove(id: number) {
    return `This action removes a #${id} answer`;
  }
}
