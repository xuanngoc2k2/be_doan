import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeQuestionService } from './type_question.service';
import { CreateTypeQuestionDto } from './dto/create-type_question.dto';
import { UpdateTypeQuestionDto } from './dto/update-type_question.dto';

@Controller('type-question')
export class TypeQuestionController {
  constructor(private readonly typeQuestionService: TypeQuestionService) {}

  @Post()
  create(@Body() createTypeQuestionDto: CreateTypeQuestionDto) {
    return this.typeQuestionService.create(createTypeQuestionDto);
  }

  @Get()
  findAll() {
    return this.typeQuestionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeQuestionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeQuestionDto: UpdateTypeQuestionDto) {
    return this.typeQuestionService.update(+id, updateTypeQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeQuestionService.remove(+id);
  }
}
