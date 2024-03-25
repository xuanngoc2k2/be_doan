import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  @ResponseMessage("Tạo mới khóa học")
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ResponseMessage("Lấy thông tin tất cả khóa học")
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.courseService.findOne(+id);
  }

  @Post('/search')
  findOneLikeName(@Body('search') search: string) {
    return this.courseService.findOneLikeName(search);
  }

  @Put(':id')
  @ResponseMessage("Update Course")
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  @ResponseMessage("Delete Course")
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
