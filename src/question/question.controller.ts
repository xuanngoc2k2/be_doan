import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Admin, Public, ResponseMessage } from 'src/decorator/customize';
import { Question } from './entities/question.entity';
import { Group_Question } from 'src/group_question/entities/group_question.entity';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Admin()
  @Post()
  @ResponseMessage("Tạo mới câu hỏi")
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Admin()
  @Post('create-new')
  @ResponseMessage("Tạo mới câu hỏi")
  createNew(@Body('question') question: Question[], @Body('group_question') group_question: Group_Question) {
    return this.questionService.createNewQuestion(question, group_question);
  }


  @Get()
  @ResponseMessage("Lấy thông tin all câu hỏi")
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  @Admin()
  @ResponseMessage("Lấy thông tin câu hỏi theo id")
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Post('group/:id')
  @ResponseMessage("Lấy thông tin câu hỏi theo id group")
  findQuestion(@Param('id') id: string) {
    return this.questionService.findQuestionByGroup(+id);
  }

  @Post('detail/:id')
  @ResponseMessage("Lấy thông tin câu hỏi theo id")
  findOneQuestion(@Param('id') id: string) {
    return this.questionService.findOneQuestion(+id);
  }

  @Post('random')
  @Public()
  @ResponseMessage("Random câu hỏi theo ")
  Random3Question() {
    return this.questionService.Random3Question();
  }
  @Post('search')
  @ResponseMessage("Search câu hỏi")
  search(@Body('search') search?: string,
    @Body('groupQuestion') groupQuestion?: number,
    @Body('type') type?: string) {
    return this.questionService.searchQuestion(search, groupQuestion, type);
  }

  @Post('check')
  @ResponseMessage("Check answer câu hỏi")
  checkAnswer(@Body('answer') answer?: string, @Body('idQues') idQues?: string) {
    return this.questionService.checkAnswer(answer, +idQues);
  }

  // @Admin()
  @Post('/answer/:id')
  @ResponseMessage("Tìm câu trả lời của câu hỏi")
  findAnswer(@Param('id') id: string) {
    return this.questionService.findAnswer(+id);
  }

  @Admin()
  @Put(':id')
  @ResponseMessage("Update thông tin câu hỏi theo id")
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Admin()
  @Delete(':id')
  @ResponseMessage("Delete thông tin câu hỏi theo id")
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
