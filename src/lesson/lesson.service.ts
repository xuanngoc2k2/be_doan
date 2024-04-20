import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { IsNumber } from 'class-validator';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>
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
    const result = await this.lessonRepo.update({ id }, { ...updateLessonDto });
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