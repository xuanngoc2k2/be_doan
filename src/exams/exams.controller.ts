import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Admin, Public, ResponseMessage } from 'src/decorator/customize';
import { Exam } from './entities/exam.entity';
import { Group_Question } from 'src/group_question/entities/group_question.entity';
import { Question } from 'src/question/entities/question.entity';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) { }

  // @Post()
  // @Admin()
  // @ResponseMessage("Tạo mới exam")
  // create(@Body('exam') exam: Exam, @Body('group_questions') group_questions: Group_Question[]) {
  //   return this.examsService.create(exam, group_questions);
  // }

  @Post()
  @Admin()
  @ResponseMessage("Tạo mới exam")
  create(@Body('exam') exam: Exam, @Body('questions') questions: Question[]) {
    return this.examsService.create2(exam, questions);
  }

  @Get()
  @Public()
  @ResponseMessage("Lấy tất cả exam")
  findAll() {
    return this.examsService.findAll2();
  }

  @Post('/test')
  @Public()
  @ResponseMessage("Lấy tất cả exam 2")
  findAll2() {
    return this.examsService.findAll2();
  }

  @Get(':id')
  @Public()
  @ResponseMessage("Lấy exam theo id")
  findOne(@Param('id') id: string) {
    return this.examsService.findOne2(+id);
  }

  @Post('/question/:id')
  // @Public()
  @ResponseMessage("Lấy câu hỏi của exam theo id")
  findQuestionExam(@Param('id') id: string) {
    return this.examsService.findQuestionExam2(+id);
  }

  @Post('search')
  // @Public()
  @ResponseMessage("Tìm kiếm câu hỏi")
  seachExam(@Body('search') search: string,
    @Body('type') type: string
  ) {
    return this.examsService.searchExam(search, type);
  }


  @Put(':id')
  @Admin()
  @ResponseMessage("Update Exam")
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(+id, updateExamDto);
  }

  @Delete(':id')
  @Admin()
  @ResponseMessage("Delete Exam")
  remove(@Param('id') id: string) {
    return this.examsService.remove(+id);
  }
}
