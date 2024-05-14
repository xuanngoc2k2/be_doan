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
      .innerJoin('answer.question', 'question').where('question.id=:id', { id: createAnswerDto.questionId }).getMany();


    if (answers.some((answer) => answer.is_true === true) && createAnswerDto.is_true) {
      throw new BadRequestException("Câu hỏi chỉ có 1 đáp án đúng");
    }
    if (!question) {
      throw new NotFoundException("Không tìm thấy câu hỏi");
    }
    const newAnswer = await this.answerRepo.create({ ...createAnswerDto, is_true: createAnswerDto.is_true ? true : false, question: question });
    return await this.answerRepo.save(newAnswer);
  }

  async findAll() {
    return await this.answerRepo.find({});
  }

  async findOne(id: number) {
    return await this.answerRepo.findOne({ where: { id } });
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto) {
    const answer = await this.answerRepo.findOne({ where: { id } })
    if (!answer) {
      throw new NotFoundException("Không tìm thấy câu trả lời");
    }
    // let question = null;

    // if (updateAnswerDto.questionId) {
    //   question = await this.questionRepo.findOne({ where: { id: updateAnswerDto.questionId } });
    // }
    // else {
    //   question = await this.questionRepo.findOne({ where: { id: answer.question.id } });
    // }

    // const answers = await this.answerRepo.createQueryBuilder('answer')
    //   .innerJoin('answer.question', 'question')
    //   .where('question.id=:id', { id: question.id })
    //   .getMany()

    // if (answers.some((answer) => answer.is_true === true) && updateAnswerDto.is_true) {
    //   throw new BadRequestException("Câu hỏi chỉ có 1 đáp án đúng");
    // }

    // if (!question) {
    //   throw new NotFoundException("Không tìm thấy câu hỏi");
    // }

    // const updateAnswer = await this.answerRepo.update({ id }, { ...updateAnswerDto, is_true: updateAnswerDto.is_true ? true : false, question: question });
    const updateAnswer = await this.answerRepo.update({ id }, { ...updateAnswerDto });
    if (updateAnswer.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }
    return { success: true };
  }

  async remove(id: number) {
    const answer = await this.answerRepo.findOne({ where: { id } });
    if (!answer) {
      throw new NotFoundException("Không tìm thấy câu trả lời");
    }
    const deleteAnswer = await this.answerRepo.softDelete({ id });
    if (deleteAnswer.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }
    return { success: true };
  }

  checkAnswer = async (questionId: number, user_answer: string) => {
    const answer = await this.answerRepo
      .createQueryBuilder('answer')
      .innerJoin('answer.question', 'question')
      .where('answer.id = :user_answer AND question.id = :questionId', { user_answer, questionId })
      .getOne();

    if (!answer) {
      return false; // Không tìm thấy câu trả lời
    }

    return answer.is_true; // Trả về giá trị của trường is_true
    return false;
    const question = await this.questionRepo.findOne({ where: { id: questionId } });
    const answers = await this.answerRepo
      .createQueryBuilder('answer')
      .innerJoin('answer.question', 'question')
      .where('question.id=:id', { id: questionId })
      .getMany();
    for (const answer of answers) {
      if (answer.answer == user_answer && answer.is_true) {
        return true;
      }
    }
    return false;
  }
}
