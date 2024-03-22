import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserCourseService } from './user_course.service';
import { CreateUserCourseDto } from './dto/create-user_course.dto';
import { UpdateUserCourseDto } from './dto/update-user_course.dto';

@Controller('user-course')
export class UserCourseController {
  constructor(private readonly userCourseService: UserCourseService) {}

  @Post()
  create(@Body() createUserCourseDto: CreateUserCourseDto) {
    return this.userCourseService.create(createUserCourseDto);
  }

  @Get()
  findAll() {
    return this.userCourseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCourseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserCourseDto: UpdateUserCourseDto) {
    return this.userCourseService.update(+id, updateUserCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCourseService.remove(+id);
  }
}
