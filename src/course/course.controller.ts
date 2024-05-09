import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Admin, Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  @ResponseMessage("Tạo mới khóa học")
  @Admin()
  create(@Body() createCourseDto: CreateCourseDto, @User() user: IUser) {
    return this.courseService.create(createCourseDto);
  }

  @Post('/all')
  @Public()
  @ResponseMessage("Lấy thông tin tất cả khóa học")
  findAll(@Body('user') user?: IUser) {
    return this.courseService.findAll(user);
  }

  @Get()
  @Admin()
  @ResponseMessage("Admin lấy thông tin tất cả khóa học")
  getAllCourse(@User() user: IUser) {
    return this.courseService.findAll();
  }

  @Post('allWithLesson/:id')
  @Admin()
  @ResponseMessage("Admin lấy thông tin tất cả khóa học bao gồm lessons")
  getAllCourseWithLesson(@Param('id') id: string, @User() user: IUser) {
    return this.courseService.getAllCourseWithLesson(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.courseService.findOne(+id);
  }

  @Post('/search')
  findOneLikeName(@Body('search') search: string, @Body('level') level: number[]) {
    return this.courseService.findOneLikeName(search, level);
  }

  @Post(':id')
  @Public()
  getCourseDetail(@Param('id') id: string, @Body('user') user?: IUser) {
    return this.courseService.getCourseDetail(+id, user);
  }


  @Put(':id')
  @Admin()
  @ResponseMessage("Update Course")
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  @Admin()
  @ResponseMessage("Delete Course")
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
