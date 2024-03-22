import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserLessonService } from './user_lesson.service';
import { CreateUserLessonDto } from './dto/create-user_lesson.dto';
import { UpdateUserLessonDto } from './dto/update-user_lesson.dto';

@Controller('user-lesson')
export class UserLessonController {
  constructor(private readonly userLessonService: UserLessonService) {}

  @Post()
  create(@Body() createUserLessonDto: CreateUserLessonDto) {
    return this.userLessonService.create(createUserLessonDto);
  }

  @Get()
  findAll() {
    return this.userLessonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userLessonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserLessonDto: UpdateUserLessonDto) {
    return this.userLessonService.update(+id, updateUserLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userLessonService.remove(+id);
  }
}
