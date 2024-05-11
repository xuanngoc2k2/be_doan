import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Admin, ResponseMessage } from 'src/decorator/customize';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) { }

  @Post()
  @Admin()
  @ResponseMessage("Tạo mới answer")
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(createAnswerDto);
  }

  @Get()
  @Admin()
  findAll() {
    return this.answerService.findAll();
  }

  @Get(':id')
  @Admin()
  findOne(@Param('id') id: string) {
    return this.answerService.findOne(+id);
  }

  @Put(':id')
  @Admin()
  @ResponseMessage("Update answer")
  update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    return this.answerService.update(+id, updateAnswerDto);
  }

  @Delete(':id')
  @Admin()
  @ResponseMessage("Delete answer")
  remove(@Param('id') id: string) {
    return this.answerService.remove(+id);
  }
}
