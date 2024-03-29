import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupQuestionService } from './group_question.service';
import { CreateGroupQuestionDto } from './dto/create-group_question.dto';
import { UpdateGroupQuestionDto } from './dto/update-group_question.dto';

@Controller('group-question')
export class GroupQuestionController {
  constructor(private readonly groupQuestionService: GroupQuestionService) {}

  @Post()
  create(@Body() createGroupQuestionDto: CreateGroupQuestionDto) {
    return this.groupQuestionService.create(createGroupQuestionDto);
  }

  @Get()
  findAll() {
    return this.groupQuestionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupQuestionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupQuestionDto: UpdateGroupQuestionDto) {
    return this.groupQuestionService.update(+id, updateGroupQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupQuestionService.remove(+id);
  }
}
