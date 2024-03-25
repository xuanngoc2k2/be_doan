import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) { }
  async create(createCourseDto: CreateCourseDto) {
    if (!Number.isInteger(Number(createCourseDto.level_required))) {
      throw new BadRequestException("Level Required phải là số nguyên !!")
    }
    const newCourse = await this.courseRepo.create(createCourseDto);
    return await this.courseRepo.save(newCourse);
  }

  findAll() {
    return this.courseRepo.find({});
  }

  findOne(id: number) {
    return this.courseRepo.find({ where: { id } });
  }

  async findOneLikeName(search: string) {
    return this.courseRepo.find({
      where: {
        description: Like(`%${search}%`) // Sử dụng Like và thêm % để tìm kiếm theo một phần của chuỗi
      }
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const result = await this.courseRepo.update({ id: id }, { ...updateCourseDto });
    if (result.affected === 0) {
      throw new NotFoundException('Không tìm thấy khóa học để cập nhật');
    }
    return { success: true };
  }

  async remove(id: number) {
    const rs = await this.courseRepo.softDelete({ id });
    if (rs.affected === 0) {
      throw new BadRequestException("Không thể xóa được !");
    }
    return { success: true };
  }
}
