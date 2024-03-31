import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDetailDto } from './dto/create-result_detail.dto';
import { UpdateResultDetailDto } from './dto/update-result_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Result_Detail } from './entities/result_detail.entity';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { Result } from 'src/result/entities/result.entity';
import { QuestionService } from 'src/question/question.service';
import { AnswerService } from 'src/answer/answer.service';

@Injectable()
export class ResultDetailService {
  constructor(
    @InjectRepository(Result_Detail)
    private resultDetailRepo: Repository<Result_Detail>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(Result)
    private resultRepo: Repository<Result>,
    private readonly answerService: AnswerService
  ) { }

  async create(createResultDetailDto: CreateResultDetailDto[]) {
    for (const result of createResultDetailDto) {
      if (!await this.questionRepo.findOne({ where: { id: result.questionId } })) {
        throw new BadRequestException(`Không tìm thấy câu hỏi ${result.questionId}`);
      }

      if (!await this.resultRepo.findOne({ where: { id: result.resultId } })) {
        throw new BadRequestException(`Không tìm thấy result ${result.questionId}`);
      }
      const is_correct = await this.answerService.checkAnswer(result.questionId, result.user_answer);
      const newRDetail = await this.resultDetailRepo.create({ ...result, is_correct })
      await this.resultDetailRepo.save(newRDetail);
    }
    return { sucess: true };
  }

  findAll() {
    return `This action returns all resultDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resultDetail`;
  }

  update(id: number, updateResultDetailDto: UpdateResultDetailDto) {
    return `This action updates a #${id} resultDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} resultDetail`;
  }
}
