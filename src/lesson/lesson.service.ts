import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { IsNumber } from 'class-validator';
import { Comment } from 'src/comment/entities/comment.entity';
import { Question } from 'src/question/entities/question.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>
  ) {

  }

  async create(createLessonDto: CreateLessonDto) {
    const findCourse = await this.courseRepo.findOne({ where: { id: createLessonDto.courseId } })
    if (!findCourse) {
      throw new BadRequestException("Không tìm thấy khóa học");
    }
    const newLesson = this.lessonRepo.create({
      ...createLessonDto,
      course: findCourse, // Gán course từ findCourse
    });

    return this.lessonRepo.save(newLesson);
  }

  findAll() {
    return this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.course', 'course') // Inner join với bảng Course và select các thông tin của Course
      .getMany();
  }

  async findOne(id: number) {
    const lesson = await this.lessonRepo.
      createQueryBuilder('lesson').
      innerJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.question', 'question')
      .leftJoinAndSelect('question.group_question', 'group_question')
      .where('lesson.id = :id', { id }) // Chỉ định điều kiện tìm kiếm bằng ID
      .getOne();
    return lesson;
  }

  findLessonByCourse = async (courseId) => {
    if (!await this.courseRepo.find({ where: { id: courseId } })) {
      throw new BadRequestException("Không tìm thấy khóa học");
    }
    const Lessons = await this.lessonRepo.find({ where: { course: { id: courseId } } });
    return Lessons;
  }

  search = async (search: string, courseId: number) => {
    const queryBuilder = this.lessonRepo.createQueryBuilder("lesson");

    // Thêm điều kiện tìm kiếm theo mô tả
    if (search) {
      queryBuilder.andWhere("lesson.lesson_name LIKE :search", { search: `%${search}%` });
    }

    // Thêm điều kiện tìm kiếm theo level_required
    if (courseId && courseId != 0) {
      queryBuilder.andWhere("lesson.courseId =:courseId", { courseId });
    }

    // Thực hiện truy vấn và trả về kết quả
    return await queryBuilder.getMany();
  }

  getComment = async (lessonId: number) => {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new BadRequestException('Không tìm thấy bài học');
    }

    const comments = await this.commentRepo.createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'user')
      .where('comment.lessonId = :lessonId', { lessonId })
      .getMany(); // Sử dụng getMany để thực hiện truy vấn và nhận kết quả

    return comments;
  }

  checkLastLesson = async (id: number) => {
    const course = await this.courseRepo.createQueryBuilder('course').leftJoinAndSelect('course.lessons', 'lesson').getOne();
    const lesson = await this.lessonRepo.findOne({ where: { id } });
    console.log(course.lessons.length, lesson.order)
    if (course.lessons.length == lesson.order) {
      return true;
    }
    return false;
  }
  findCourseId = async (id) => {
    const idCourse = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .where('lesson.id=:id', { id })
      .getOne()
    return idCourse.course.id;
  }
  async update(id: number, updateLessonDto: UpdateLessonDto) {
    if (Number.isNaN(Number(id))) {
      throw new BadRequestException("ID phải là số!!")
    }
    const lesson = this.lessonRepo.find({ where: { id } });
    if (!lesson) {
      throw new BadRequestException("Không tìm thấy bài học");
    }
    let course = updateLessonDto.course;
    if (updateLessonDto.courseId) {
      course = await this.courseRepo.findOne({ where: { id: updateLessonDto.courseId } });
      if (!course) {
        throw new BadRequestException("Không tìm thấy khóa học");
      }
    }
    const question = await this.questionRepo.findOne({ where: { id: updateLessonDto.questionId } });
    if (updateLessonDto.isQuestion) {
      updateLessonDto.content = null;
      updateLessonDto.duration = "0:00";
    }
    const { courseId, ...updateData } = updateLessonDto;
    const result = await this.lessonRepo.update({ id }, { ...updateData, question: question, course: course });
    if (result.affected === 0) {
      throw new BadRequestException("Cập nhật lỗi !");
    }
    return { success: true };
  }

  async remove(id: number) {
    if (Number.isNaN(Number(id))) {
      throw new BadRequestException("ID phải là số!!")
    }
    const lesson = await this.lessonRepo.find({ where: { id } });
    if (lesson.length === 0) {
      throw new BadRequestException("Không tìm thấy bài học");
    }
    const rs = await this.lessonRepo.softDelete({ id });
    if (rs.affected === 0) {
      throw new BadRequestException("Không thể xóa được !");
    }
    return { success: true };
  }
}