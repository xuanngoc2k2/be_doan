import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { Repository } from 'typeorm';
import { Group_Question } from 'src/group_question/entities/group_question.entity';
import { ppid } from 'process';
import { GroupQuestionService } from 'src/group_question/group_question.service';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
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
    const rs = await this.examRepo
      .createQueryBuilder('exam')
      .innerJoinAndSelect('exam.examGrquestions', 'examGrquestions')
      .innerJoinAndSelect('examGrquestions.groupQuestion', 'groupQuestion')
      .innerJoinAndSelect('groupQuestion.questions', 'question')
      .leftJoinAndSelect('exam.results', 'result')
      .getMany()

    const result = []
    rs.forEach((exam) => {
      let countTypeQuestion = exam.examGrquestions.length;
      let countUser = exam.results.length;
      let countQuestion = 0;
      exam.examGrquestions.map((eg) => {
        countQuestion += eg.groupQuestion.questions.length;
      })
      const { examGrquestions, results, ...examWithoutGroupQuestions } = exam
      result.push({
        ...examWithoutGroupQuestions, // Lấy các thuộc tính của exam từ phần tử đầu tiên của mảng rs
        countTypeQuestion,
        countQuestion,
        countUser
      });
    });

    // const examsWithoutGroupQuestions = rs.map((exam) => {
    //   const { group_questions, ...examWithoutGroupQuestions } = exam;
    //   return examWithoutGroupQuestions;
    // });
    // rs.map(()=>{

    // })


    return result;

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
