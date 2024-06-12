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
import { Group_Question } from 'src/group_question/entities/group_question.entity';

@Injectable()
export class ResultDetailService {
  constructor(
    @InjectRepository(Result_Detail)
    private resultDetailRepo: Repository<Result_Detail>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(Result)
    private resultRepo: Repository<Result>,
    private readonly answerService: AnswerService,
    @InjectRepository(Group_Question)
    private grQRepo: Repository<Group_Question>,
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
    return { success: true };
  }

  async countScore(id: number) {
    const result = await this.resultDetailRepo
      .createQueryBuilder('result_detail')
      .innerJoinAndSelect('result_detail.question', 'question')
      .where('result_detail.resultId = :id', { id })
      .select(['result_detail.is_correct', 'question.score'])
      .getMany();
    let score = 0;
    result.forEach((rs) => {
      if (rs.is_correct) {
        score += rs.question.score
      }
    })
    return score;
  }

  findQuestionExamResult = async (id: number) => {
    const rs = await this.grQRepo
      .createQueryBuilder('group_question')
      .innerJoinAndSelect('group_question.questions', 'question')
      .innerJoinAndSelect('question.answers', 'answer')
      .innerJoinAndSelect('question.result_details', 'result_detail')
      .where('result_detail.resultId =:id', { id })
      .select([
        'group_question.id',
        'group_question.description',
        'group_question.content',
        'group_question.audio',
        'group_question.image',
        'question.id',
        'question.question',
        'question.level',
        'question.type',
        'question.score',
        'answer.id',
        'answer.answer',
        'answer.isImage',
        'answer.is_true',
        'result_detail'
      ])
      .getMany();
    return rs;
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
