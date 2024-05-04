import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { Repository } from 'typeorm';
import { Group_Question } from 'src/group_question/entities/group_question.entity';
import { ppid } from 'process';
import { GroupQuestionService } from 'src/group_question/group_question.service';
import { ExamGrquestion } from 'src/exam-grquestion/entities/exam-grquestion.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
    @InjectRepository(ExamGrquestion)
    private examGrRepo: Repository<ExamGrquestion>,
  ) {
  }
  async create(exam: Exam, group_questions: Group_Question[]) {
    if (await this.examRepo.findOne({ where: { exam_name: exam.exam_name } })) {
      throw new BadRequestException("Đã tồn tại bài thi này")
    }
    if (exam.startAt > exam.endAt) {
      throw new BadRequestException("endAt phải sau startAt");
    }
    const newExam = await this.examRepo.create({ ...exam });
    await this.examRepo.save(newExam)
    await Promise.all(group_questions.map(async (group_question) => {
      const listQuestion = [];
      if (group_question.id) {
        group_question.questions.map((question) => {
          listQuestion.push(question.id);
        });
      }
      await this.examGrRepo.save(await this.examGrRepo.create({ examId: newExam.id, groupQuestionId: group_question.id, listQuestion: listQuestion.toString() }));
    }));

    return newExam;
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
    const examGr = await this.examGrRepo
      .createQueryBuilder('examGrquestions')
      .where('examGrquestions.examId = :examId', { examId: id })
      .select(['examGrquestions.listQuestion'])
      .getMany();
    const listQuestion = [];
    examGr.map((ls) => {
      if (ls.listQuestion != '') {
        listQuestion.push(...ls.listQuestion.split(','));
      }
    });
    const rs = await this.examRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.examGrquestions', 'examGrquestions')
      .leftJoinAndSelect('examGrquestions.groupQuestion', 'groupQuestion')
      .leftJoinAndSelect('groupQuestion.questions', 'question')
      .leftJoinAndSelect('question.answers', 'answer')
      .where('exam.id = :id', { id });

    if (listQuestion.length !== 0) {
      rs.andWhere('question.id IN (:...listQuestion)', { listQuestion });
    }

    const result = await rs
      .select([
        'exam.duration',
        'examGrquestions.groupQuestionId',
        'examGrquestions.listQuestion',
        'groupQuestion.id',
        'groupQuestion.description',
        'groupQuestion.content',
        'groupQuestion.image',
        'groupQuestion.type',
        'groupQuestion.audio',
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

    return result;
  }

  searchExam = async (search: string, type?: string) => {
    const queryBuilder = await this.examRepo.createQueryBuilder('exam')
    if (search) {
      queryBuilder.andWhere("exam.exam_name LIKE :search", { search: `%${search}%` });
    }
    if (type) {
      queryBuilder.andWhere('exam.type = :type', { type })
    }
    queryBuilder.andWhere("exam.deleted_at IS NULL");
    return await queryBuilder.getMany();
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
