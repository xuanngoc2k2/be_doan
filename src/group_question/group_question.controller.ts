import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { GroupQuestionService } from './group_question.service';
import { CreateGroupQuestionDto } from './dto/create-group_question.dto';
import { UpdateGroupQuestionDto } from './dto/update-group_question.dto';
import { Admin, ResponseMessage } from 'src/decorator/customize';

@Controller('group-question')
export class GroupQuestionController {
  constructor(private readonly groupQuestionService: GroupQuestionService) { }

  @Admin()
  @Post()
  @ResponseMessage("Tạo mới group question")
  create(@Body() createGroupQuestionDto: CreateGroupQuestionDto) {
    return this.groupQuestionService.create(createGroupQuestionDto);
  }

  @Get()
  @Admin()
  @ResponseMessage("Lấy tất cả group question")
  findAll() {
    return this.groupQuestionService.findAll();
  }

  @Get(':id')
  @ResponseMessage("Lấy group question bằng id")
  findOne(@Param('id') id: string) {
    return this.groupQuestionService.findOne(+id);
  }

  @Get('question/:id')
  @ResponseMessage("Lấy question của question bằng id")
  findQuestion(@Param('id') id: string) {
    return this.groupQuestionService.findQuestion(+id);
  }

  @ResponseMessage("Update group question")
  @Admin()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateGroupQuestionDto: UpdateGroupQuestionDto) {
    return this.groupQuestionService.update(+id, updateGroupQuestionDto);
  }

  @Admin()
  @ResponseMessage("Delete group question")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupQuestionService.remove(+id);
  }
}
