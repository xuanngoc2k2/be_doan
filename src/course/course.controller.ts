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

  @Get()
  @Public()
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
