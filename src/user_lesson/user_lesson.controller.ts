import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserLessonService } from './user_lesson.service';
import { CreateUserLessonDto } from './dto/create-user_lesson.dto';
import { UpdateUserLessonDto } from './dto/update-user_lesson.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('user-lesson')
export class UserLessonController {
  constructor(private readonly userLessonService: UserLessonService) { }

  @Post()
  @ResponseMessage("Học mới bài học")
  create(@Body('lessonId') lessonId: string, @User() user: IUser) {
    return this.userLessonService.create(+lessonId, user);
  }

  @Get()
  @ResponseMessage("Lấy tất cả bài học của user")
  findAll(@User() user: IUser) {
    return this.userLessonService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userLessonService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage("Update trạng thái lesson đã hoàn thành")
  update(@Param('id') id: string, @User() user: IUser) {
    return this.userLessonService.update(+id, user);
  }

  @Put(':id/:time')
  @ResponseMessage("Update thời gian cuối cùng học lesson")
  updateCurrenTime(@Param('id') id: string, @Param('time') time: string, @User() user: IUser) {
    return this.userLessonService.updateTime(+id, time, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userLessonService.remove(+id);
  }
}
