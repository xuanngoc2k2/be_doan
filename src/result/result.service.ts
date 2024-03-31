import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Repository } from 'typeorm';
import { Exam } from 'src/exams/entities/exam.entity';
import { Result_Detail } from 'src/result_detail/entities/result_detail.entity';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private resultRepo: Repository<Result>,
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
    @InjectRepository(Result_Detail)
    private resultDetailRepo: Repository<Result_Detail>
  ) { }
  async create(createResultDto: CreateResultDto, user: IUser) {
    const exam = await this.examRepo.findOne({ where: { id: createResultDto.examId } });
    if (!exam) {
      throw new NotFoundException("Không tìm thấy Exam");
    }
    const count = (await this.lastCount(user.id, exam.id));

    const newResult = await this.resultRepo.create({ ...createResultDto, count, user: user, exam })
    return await this.resultRepo.save(newResult);
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
    return await this.resultRepo.find({ where: { userId: user.id } });
  }

  findOne(id: number) {
    return `This action returns a #${id} result`;
  }

  async update(id: number, updateResultDto: UpdateResultDto) {
    return `This action updates a #${id} result`;
  }

  remove(id: number) {
    return `This action removes a #${id} result`;
  }
}
