import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamQuestionService } from './examquestion.service';
import { CreateExamQuestionDto } from './dto/create-examquestion.dto';
import { UpdateExamQuestionDto } from './dto/update-examquestion.dto';

@Controller('examquestion')
export class ExamQuestionController {
  constructor(private readonly examquestionService: ExamQuestionService) { }

  @Post()
  create(@Body() createExamquestionDto: CreateExamQuestionDto) {
    return this.examquestionService.create(createExamquestionDto);
  }

  @Get()
  findAll() {
    return this.examquestionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examquestionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamquestionDto: UpdateExamQuestionDto) {
    return this.examquestionService.update(+id, updateExamquestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examquestionService.remove(+id);
  }
}
