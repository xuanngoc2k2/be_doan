import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { Repository } from 'typeorm';
import { Group_Question } from 'src/group_question/entities/group_question.entity';
import { ppid } from 'process';
import { GroupQuestionService } from 'src/group_question/group_question.service';
// import { ExamGrquestion } from 'src/exam-grquestion/entities/exam-grquestion.entity';
import { Question } from 'src/question/entities/question.entity';
import { ExamQuestion } from 'src/examquestion/entities/examquestion.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
    // @InjectRepository(ExamGrquestion)
    // private examGrRepo: Repository<ExamGrquestion>,
    @InjectRepository(ExamQuestion)
    private examQuestionRepo: Repository<ExamQuestion>,
  ) {
  }

  // async create(exam: Exam, group_questions: Group_Question[]) {
  //   if (exam.startAt > exam.endAt) {
  //     throw new BadRequestException("endAt phải sau startAt");
  //   }
  //   const newExam = await this.examRepo.create({ ...exam });
  //   await this.examRepo.save(newExam)
  //   await Promise.all(group_questions.map(async (group_question) => {
  //     const listQuestion = [];
  //     if (group_question.id) {
  //       group_question.questions.map((question) => {
  //         listQuestion.push(question.id);
  //       });
  //     }
  //     await this.examGrRepo.save(await this.examGrRepo.create({ examId: newExam.id, groupQuestionId: group_question.id, listQuestion: listQuestion.toString() }));
  //   }));

  //   return newExam;
  // }

  async create2(exam: Exam, questions: Question[]) {
    if (exam.startAt > exam.endAt) {
      throw new BadRequestException("endAt phải sau startAt");
    }
    const newExam = await this.examRepo.create({ ...exam });
    await this.examRepo.save(newExam)
    await Promise.all(questions.map(async (question) => {
      await this.examQuestionRepo.save(await this.examQuestionRepo.create({ examId: newExam.id, questionId: question.id }));
    }
    ));
    return newExam;
  }

  async findAll2(type?: number) {
    if (type) {
      const rs = await this.examRepo
        .createQueryBuilder('exam')
        .leftJoinAndSelect('exam.examQuestions', 'exam_question')
        .leftJoinAndSelect('exam_question.question', 'question')
        .leftJoinAndSelect('exam.results', 'result')
        .leftJoinAndSelect('question.group_question', 'group_question');
      if (type == 1) {
        rs.where("exam.type = 'TOPIK I'");
      } else if (type == 2) {
        rs.where("exam.type = 'TOPIK II'");
      } else if (type == 3) {
        rs.where("exam.type = 'EPS'");
      }
      return this.configResult2(await rs.getMany());
    }
    const rs = await this.examRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.examQuestions', 'exam_question')
      .leftJoinAndSelect('exam_question.question', 'question')
      .leftJoinAndSelect('exam.results', 'result')
      .leftJoinAndSelect('question.group_question', 'group_question')
      .getMany()
    // return rs;
    return this.configResult2(rs);
  }

  configResult2 = (rs) => {
    const result = []
    rs.forEach((exam) => {
      let countUser = exam.results.length;
      let countQuestion = exam.examQuestions.length;
      let countTypeQuestion = exam.examQuestions.reduce((count, examQuestion) => {
        if (examQuestion.question.group_question && !count.includes(examQuestion.question.group_question.id)) {
          count.push(examQuestion.question.group_question.id); // Thêm id của group_question vào mảng count
        }
        return count;
      }, []).length;

      const { examQuestions, results, ...examWithoutGroupQuestions } = exam
      result.push({
        ...examWithoutGroupQuestions, // Lấy các thuộc tính của exam từ phần tử đầu tiên của mảng rs
        countTypeQuestion,
        countQuestion,
        countUser
      });
    });
    return result;
  }

  configResult = (rs) => {
    const result = []
    rs.forEach((exam) => {
      let countTypeQuestion = exam.examGrquestions.length;
      let countUser = exam.results.length;
      let countQuestion = 0;
      exam.examGrquestions.map((eg) => {
        if (eg.listQuestion) {
          const listQuestionIds = eg.listQuestion.split(',').map(Number); // Chuyển đổi listQuestion thành mảng các ID câu hỏi
          eg.groupQuestion.questions.forEach((question) => {
            if (listQuestionIds.includes(question.id)) {
              countQuestion++;
            }
          });
        }
        else {
          countQuestion += eg.groupQuestion.questions.length;
        }
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
    // return rs;


    return this.configResult(rs);

  }

  async findOne2(id: number) {
    const rss = await this.examRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.examQuestions', 'exam_question')
      .leftJoinAndSelect('exam_question.question', 'question')
      .leftJoinAndSelect('exam.results', 'result')
      .leftJoinAndSelect('question.group_question', 'group_question')
      .where('exam.id = :id', { id })
      .getMany()
    return this.configResult2(rss)[0];
  }

  // async findOne(id: number) {
  //   const examGr = await this.examGrRepo
  //     .createQueryBuilder('examGrquestions')
  //     .where('examGrquestions.examId = :examId', { examId: id })
  //     .select(['examGrquestions.listQuestion'])
  //     .getMany();
  //   const listQuestion = [];
  //   examGr.map((ls) => {
  //     if (ls.listQuestion != '') {
  //       listQuestion.push(...ls.listQuestion.split(','));
  //     }
  //   })
  //   const rs = await this.examRepo
  //     .createQueryBuilder('exam')
  //     .leftJoinAndSelect('exam.examGrquestions', 'examGrquestions')
  //     .leftJoinAndSelect('examGrquestions.groupQuestion', 'groupQuestion')
  //     .leftJoinAndSelect('groupQuestion.questions', 'question')
  //     .leftJoinAndSelect('exam.results', 'result')
  //     .where('exam.id = :id', { id })
  //   if (listQuestion.length !== 0) {
  //     rs.andWhere('question.id IN (:...listQuestion)', { listQuestion });
  //   }
  //   const rss = await rs.getMany();
  //   return this.configResult(rss)[0];
  // }

  findQuestionExam2 = async (id: number) => {
    const rss = await this.examRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.examQuestions', 'exam_question')
      .leftJoinAndSelect('exam_question.question', 'question')
      .leftJoinAndSelect('question.answers', 'answer')
      .leftJoinAndSelect('question.group_question', 'group_question')
      .where('exam_question.examId = :id', { id })
      .select(['exam', 'exam_question', 'group_question', 'question', 'answer.id', 'answer.answer', 'answer.isImage'])
      .getOne();
    // return rss;
    if (!rss) {
      return null; // Không tìm thấy kết quả, trả về null hoặc xử lý theo cách thích hợp
    }

    const groupQuestionsWithQuestions: Group_Question[] = [];
    const { examQuestions, ...rs } = rss;

    examQuestions.forEach(examQuestion => {
      const { group_question, ...question } = examQuestion.question; // Loại bỏ group_question từ question

      const groupQuestionId = group_question.id;
      const existingGroupQuestionIndex = groupQuestionsWithQuestions.findIndex(st => st.id === groupQuestionId);

      // Nếu groupQuestion đã tồn tại trong mảng groupQuestionsWithQuestions
      if (existingGroupQuestionIndex !== -1) {
        // Thêm question vào mảng questions của groupQuestion tương ứng
        groupQuestionsWithQuestions[existingGroupQuestionIndex].questions.push(question as Question);
      } else {
        // Nếu groupQuestion chưa tồn tại trong mảng groupQuestionsWithQuestions
        // Tạo một đối tượng mới và thêm vào mảng groupQuestionsWithQuestions
        groupQuestionsWithQuestions.push({
          id: groupQuestionId, // Xác định id cho đối tượng mới
          ...group_question, // Sử dụng toàn bộ thông tin từ group_question
          questions: [question as Question] // Thêm câu hỏi vào mảng questions
        });
      }
    });

    return { ...rs, examGrquestions: groupQuestionsWithQuestions };
  }


  // findQuestionExam = async (id: number) => {
  //   const examGr = await this.examGrRepo
  //     .createQueryBuilder('examGrquestions')
  //     .where('examGrquestions.examId = :examId', { examId: id })
  //     .select(['examGrquestions.listQuestion'])
  //     .getMany();
  //   const listQuestion = [];
  //   examGr.map((ls) => {
  //     if (ls.listQuestion != '') {
  //       listQuestion.push(...ls.listQuestion.split(','));
  //     }
  //   });
  //   const rs = await this.examRepo
  //     .createQueryBuilder('exam')
  //     .leftJoinAndSelect('exam.examGrquestions', 'examGrquestions')
  //     .leftJoinAndSelect('examGrquestions.groupQuestion', 'groupQuestion')
  //     .leftJoinAndSelect('groupQuestion.questions', 'question')
  //     .leftJoinAndSelect('question.answers', 'answer')
  //     .where('exam.id = :id', { id });

  //   if (listQuestion.length !== 0) {
  //     rs.andWhere('question.id IN (:...listQuestion)', { listQuestion });
  //   }

  //   const result = await rs
  //     .select([
  //       'exam.duration',
  //       'examGrquestions.groupQuestionId',
  //       'examGrquestions.listQuestion',
  //       'groupQuestion.id',
  //       'groupQuestion.description',
  //       'groupQuestion.content',
  //       'groupQuestion.image',
  //       'groupQuestion.type',
  //       'groupQuestion.audio',
  //       'question.id',
  //       'question.question',
  //       'question.level',
  //       'question.type',
  //       'question.score',
  //       'answer.id',
  //       'answer.answer',
  //       'answer.isImage',
  //     ])
  //     .getOne();

  //   return result;
  // }

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
