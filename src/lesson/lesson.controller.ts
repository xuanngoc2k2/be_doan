import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) { }

  @Post()
  @ResponseMessage("Tạo mới bài học")
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.create(createLessonDto);
  }

  @Get()
  @ResponseMessage("Lấy thông tin tất cả bài học")
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(':id')
  @ResponseMessage("Lấy thông tin tất cả bài học bằng id")
  findOne(@Param('id') id: number) {
    return this.lessonService.findOne(+id);
  }

  @Post('/course')
  @Public()
  @ResponseMessage("Lấy thông tin bài học theo khóa học")
  handleFindLessonByCourse(@Body('courseId') courseId: number) {
    return this.lessonService.findLessonByCourse(courseId);
  }

  @Post('/comment')
  @ResponseMessage("Lấy thông tin comment bài học")
  handleGetCommentByLesson(@Body('lessonId') lessonId: string) {
    return this.lessonService.getComment(+lessonId);
  }

  @Patch(':id')
  @ResponseMessage("Cập nhật thông tin bài học")
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(+id, updateLessonDto);
  }

  @Delete(':id')
  @ResponseMessage("Xóa bài học")
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id);
  }
}
