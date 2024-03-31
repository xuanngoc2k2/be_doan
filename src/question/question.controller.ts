import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Post()
  @ResponseMessage("Tạo mới câu hỏi")
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  @ResponseMessage("Lấy thông tin all câu hỏi")
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  @ResponseMessage("Lấy thông tin câu hỏi theo id")
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Post('/answer/:id')
  @ResponseMessage("Tìm câu trả lời của câu hỏi")
  findAnswer(@Param('id') id: string) {
    return this.questionService.findAnswer(+id);
  }

  @Patch(':id')
  @ResponseMessage("Update thông tin câu hỏi theo id")
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @ResponseMessage("Delete thông tin câu hỏi theo id")
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
