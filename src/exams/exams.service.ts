import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>
  ) {
  }
  async create(createExamDto: CreateExamDto) {
    if (await this.examRepo.findOne({ where: { exam_name: createExamDto.exam_name } })) {
      throw new BadRequestException("Đã tồn tại bài thi này")
    }
    if (createExamDto.startAt > createExamDto.endAt) {
      throw new BadRequestException("endAt phải sau startAt");
    }
    const newExam = await this.examRepo.create({ ...createExamDto });
    return await this.examRepo.save(newExam);
  }

  async findAll() {
    return await this.examRepo.find({});
  }

  async findOne(id: number) {
    return await this.examRepo.find({ where: { id } });
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    if (!await this.examRepo.findOne({ where: { id } })) {
      throw new NotFoundException("Không tìm thấy exam");
    }
    if (updateExamDto.startAt > updateExamDto.endAt) {
      throw new BadRequestException("endAt phải sau startAt");
    }
    const updateExam = await this.examRepo.update({ id }, { ...updateExamDto });
    if (updateExam.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }
    return { success: true };
  }

  async remove(id: number) {
    if (!await this.examRepo.findOne({ where: { id } })) {
      throw new NotFoundException("Không tìm thấy exam");
    }
    const deleteExam = await this.examRepo.softDelete({ id });
    if (deleteExam.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }
    return { success: true };
  }
}
