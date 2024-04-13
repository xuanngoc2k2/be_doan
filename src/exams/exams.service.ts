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
  configResult = (rs) => {
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
    return result;
  }
  async findAll() {
    const rs = await this.examRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.examGrquestions', 'examGrquestions')
      .leftJoinAndSelect('examGrquestions.groupQuestion', 'groupQuestion')
      .leftJoinAndSelect('groupQuestion.questions', 'question')
      .leftJoinAndSelect('exam.results', 'result')
      .getMany()
    console.log(rs)


    // const examsWithoutGroupQuestions = rs.map((exam) => {
    //   const { group_questions, ...examWithoutGroupQuestions } = exam;
    //   return examWithoutGroupQuestions;
    // });
    // rs.map(()=>{

    // })


    return this.configResult(rs);

  }


  async findOne(id: number) {
    const rs = await this.examRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.examGrquestions', 'examGrquestions')
      .leftJoinAndSelect('examGrquestions.groupQuestion', 'groupQuestion')
      .leftJoinAndSelect('groupQuestion.questions', 'question')
      .leftJoinAndSelect('exam.results', 'result')
      .where('exam.id = :id', { id })
      .getMany()
    return this.configResult(rs)[0];
  }

  findQuestionExam = async (id: number) => {
    const rs = await this.examRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.examGrquestions', 'examGrquestions')
      .leftJoinAndSelect('examGrquestions.groupQuestion', 'groupQuestion')
      .leftJoinAndSelect('groupQuestion.questions', 'question')
      .leftJoinAndSelect('question.answers', 'answer')
      .where('exam.id = :id', { id })
      .select([
        'exam.duration',
        'examGrquestions.groupQuestionId',
        'groupQuestion.id',
        'groupQuestion.description',
        'groupQuestion.content',
        'groupQuestion.image',
        'question.id',
        'question.question',
        'question.level',
        'question.type',
        'question.score',
        'answer.id',
        'answer.answer',
        'answer.isImage',
      ])
      .getOne();
    return rs;
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
