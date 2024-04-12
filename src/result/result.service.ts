import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Repository } from 'typeorm';
import { Exam } from 'src/exams/entities/exam.entity';
import { Result_Detail } from 'src/result_detail/entities/result_detail.entity';
import { ResultDetailService } from 'src/result_detail/result_detail.service';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private resultRepo: Repository<Result>,
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
    @InjectRepository(Result_Detail)
    private resultDetailRepo: Repository<Result_Detail>,
    private resultDetailService: ResultDetailService
  ) { }

  async create(createResultDto: CreateResultDto, user: IUser) {
    const exam = await this.examRepo.findOne({ where: { id: createResultDto.examId } });
    if (!exam) {
      throw new NotFoundException("Không tìm thấy Exam");
    }
    const count = (await this.lastCount(user.id, exam.id));
    const newResult = await this.resultRepo.create({ ...createResultDto, count, user: user, exam })
    await this.resultRepo.save(newResult);
    const answers = [];
    for (const k in createResultDto.result) {
      const answer = createResultDto.result[k];
      for (const key in answer) {
        answers.push({
          resultId: newResult.id,
          questionId: key,
          user_answer: answer[key]
        }
        )
      }
    }
    console.log(createResultDto)
    await this.resultDetailService.create(answers);
    return await this.update(newResult.id, {});
    // const 
  }



  lastCount = async (userId, examId) => {
    const userResult = await this.resultRepo.find({ where: { userId, examId } });
    if (userResult.length == 0) {
      return 1;
    }
    else {
      return userResult.length + 1
    }
  }



  async findAll(user: IUser) {
    const rs = await this.resultRepo
      .createQueryBuilder('result')
      .innerJoinAndSelect('result.exam', 'exam')
      .where('result.userId = :id', { id: user.id })
      .select([
        'result',
        'exam.exam_name',
        'exam.id',
        'exam.type'
      ])
      .orderBy('result.createdAt', 'DESC') // Sắp xếp theo createdAt, DESC để sắp xếp theo thứ tự giảm dần
      .getMany()
    return rs;
  }

  async findOne(id: number, user: IUser) {
    const rs = await this.resultRepo
      .createQueryBuilder('result')
      .innerJoinAndSelect('result.exam', 'exam')
      .where('result.userId = :id AND result.id= :rId', { id: user.id, rId: id })
      .select([
        'result',
        'exam.exam_name',
        'exam.id',
        'exam.type'
      ])
      .orderBy('result.createdAt', 'DESC') // Sắp xếp theo createdAt, DESC để sắp xếp theo thứ tự giảm dần
      .getOne()
    return rs;
  }

  async update(id: number, updateResultDto: UpdateResultDto) {
    const exam = await this.examRepo.findOne({ where: { id: updateResultDto.examId } });
    if (!exam) {
      throw new NotFoundException("Không tìm thấy Exam");
    }
    const score = await this.resultDetailService.countScore(id);
    const updateResult = await this.resultRepo.update({ id }, { ...updateResultDto, score })
    if (updateResult.affected === 0) {
      throw new BadRequestException("Update lỗi")
    }
    return { success: true };
  }

  async remove(id: number) {
    if (!await this.resultRepo.findOne({ where: { id } })) {
      throw new NotFoundException("Không tìm thấy result");
    }
    const deleteResult = await this.resultRepo.softDelete({ id })
    if (deleteResult.affected === 0) {
      throw new BadRequestException("Delete lỗi")
    }
    return { success: true };
  }
}
