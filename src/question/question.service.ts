import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { Group_Question } from 'src/group_question/entities/group_question.entity';
import { NotFoundError } from 'rxjs';
import { Answer } from 'src/answer/entities/answer.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Group_Question)
    private groupQuestion: Repository<Group_Question>
  ) { }
  async create(createQuestionDto: CreateQuestionDto) {
    let groupQuestion = null;
    if (createQuestionDto?.group_questionId) {
      if (!await this.groupQuestion.findOne({ where: { id: createQuestionDto.group_questionId } })) {
        throw new NotFoundException("Không tìm thấy group question");
      }
      groupQuestion = await this.groupQuestion.findOne({ where: { id: createQuestionDto.group_questionId } })
    }
    const newQuestion = await this.questionRepo.create({ ...createQuestionDto, group_question: groupQuestion });
    return await this.questionRepo.save(newQuestion);
  }


  createNewQuestion = async (questions: Question[], group: Group_Question) => {
    try {
      let foundGroup = null;
      if (group.id) {
        foundGroup = await this.groupQuestion.findOne({ where: { id: group.id } });
        if (!foundGroup) {
          throw new NotFoundException("Không tìm thấy group question");
        }
      }
      else {
        const newGroup = await this.groupQuestion.create({ ...group });
        foundGroup = await this.groupQuestion.save(newGroup);
      }
      const newQuestions: Question[] = [];
      const newAnswers: Answer[] = [];

      // Tạo các câu hỏi mới
      for (const q of questions) {
        const newQuestion = await this.questionRepo.create({ ...q, group_question: foundGroup });
        const savedQuestion = await this.questionRepo.save(newQuestion);
        newQuestions.push(savedQuestion);

        // Tạo các câu trả lời mới cho câu hỏi
        for (const a of q.answers) {
          const newAnswer = this.answerRepository.create({ ...a, question: savedQuestion });
          const savedAnswer = await this.answerRepository.save(newAnswer);
          newAnswers.push(savedAnswer);
        }
      }
      return { newQuestions, newAnswers };
    } catch (error) {
      throw new Error("Đã xảy ra lỗi trong quá trình tạo câu hỏi mới: " + error.message);
    }
  }


  async findAll() {
    return await this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.group_question', 'group_question')
      .getMany();
  }

  async findOne(id: number) {
    return await this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.group_question', 'group_question')
      .leftJoinAndSelect('question.answers', 'answer')
      .where('question.id = :id', { id: id })
      // .andWhere('question.delete_at IS NULL')
      .getOne();
  }

  async findOneQuestion(id: number) {
    return await this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.group_question', 'group_question')
      .leftJoinAndSelect('question.answers', 'answer')
      .where('question.id = :id', { id: id })
      // .andWhere('question.delete_at IS NULL')
      .select(['question', 'group_question', 'answer.id', 'answer.answer', 'answer.isImage'])
      .getOne();
  }

  async findAnswer(id: number) {
    if (!await this.questionRepo.findOne({ where: { id } })) {
      throw new NotFoundException("Không tìm thấy câu hỏi");
    }
    const answers = await this.questionRepo
      .createQueryBuilder('question')
      .innerJoinAndSelect('question.answers', 'answer')
      .where('question.id = :id', { id })
      .select([
        'question.id',
        'answer.id',
        'answer.answer',
        'answer.explain',
        'answer.questionId',
      ])
      .getMany();
    return answers;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepo.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException("Không tìm thấy question");
    }
    const { group_questionId, ...updateQuestionDTo } = updateQuestionDto;

    // Kiểm tra và lấy thông tin của group question nếu có
    let groupQuestion = null;
    if (group_questionId) {
      groupQuestion = await this.groupQuestion.findOne({ where: { id: group_questionId } });
      if (!groupQuestion) {
        throw new NotFoundException("Không tìm thấy group question");
      }
    }

    // Thực hiện cập nhật câu hỏi
    const updateResult = await this.questionRepo.update(id, { ...updateQuestionDTo, group_question: groupQuestion });

    // Kiểm tra kết quả cập nhật
    if (updateResult.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }

    return { success: true };
  }

  async remove(id: number) {

    const question = await this.questionRepo.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException("Không tìm thấy question");
    }

    // Thực hiện cập nhật câu hỏi
    const deleteResult = await this.questionRepo.softDelete({ id });

    // Kiểm tra kết quả cập nhật
    if (deleteResult.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }

    return { success: true };
  }

  searchQuestion = async (search?: string, groupQuestion?: number, type?: string) => {
    const queryBuilder = this.questionRepo.createQueryBuilder("question")
      .leftJoinAndSelect('question.group_question', 'group_question');

    // Thêm điều kiện tìm kiếm theo mô tả
    if (search) {
      queryBuilder.andWhere("question.question LIKE :search", { search: `%${search}%` });
    }

    // Thêm điều kiện tìm kiếm theo level_required
    if (groupQuestion && groupQuestion != 0) {
      queryBuilder.andWhere("group_question.id =:Id", { Id: groupQuestion });
    }

    if (type) {
      queryBuilder.andWhere("group_question.type =:type", { type });
    }

    // Thực hiện truy vấn và trả về kết quả
    return await queryBuilder.getMany();
  }

  checkAnswer = async (id: number, idQues: number) => {
    const rs = await this.questionRepo.createQueryBuilder("question")
      .leftJoinAndSelect('question.answers', 'answer')
      .where('question.id = :idQues and answer.id = :id', { idQues, id })
      .getOne();
    return rs.answers[0].is_true;
  }

  Random3Question = async () => {
    const allQuestions = await this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.group_question', 'group_question')
      .where("group_question.content = 'Random news'")
      .leftJoinAndSelect('question.answers', 'answer')
      .getMany();
    // Lấy 3 câu hỏi ngẫu nhiên từ tất cả các câu hỏi
    const randomQuestions = this.shuffleArray(allQuestions).slice(0, 3);

    // Trả về kết quả
    return randomQuestions;
  }
  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
