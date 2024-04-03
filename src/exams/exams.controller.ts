import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Admin, ResponseMessage } from 'src/decorator/customize';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) { }

  @Post()
  @Admin()
  @ResponseMessage("Tạo mới exam")
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  @ResponseMessage("Lấy tất cả exam")
  findAll() {
    return this.examsService.findAll();
  }

  @Get(':id')
  @ResponseMessage("Lấy exam theo id")
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(+id);
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
