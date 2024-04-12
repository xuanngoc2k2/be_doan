import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultDetailService } from './result_detail.service';
import { CreateResultDetailDto } from './dto/create-result_detail.dto';
import { UpdateResultDetailDto } from './dto/update-result_detail.dto';
import { Admin, ResponseMessage, User } from 'src/decorator/customize';
import { QuestionService } from 'src/question/question.service';

@Controller('result-detail')
export class ResultDetailController {
  constructor(private readonly resultDetailService: ResultDetailService,
  ) { }

  @Post()
  @ResponseMessage("Tạo mới Result-detail")
  @Admin()
  create(@Body() createResultDetailDto: CreateResultDetailDto[]) {
    return this.resultDetailService.create(createResultDetailDto);
  }

  @Get()
  findAll() {
    return this.resultDetailService.findAll();
  }

  @Post('/:resultId')
  @ResponseMessage("Lấy câu hỏi của exam theo id")
  findQuestionExamResult(@Param('resultId') resultId: string) {
    return this.resultDetailService.findQuestionExamResult(+resultId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultDetailService.findOne(+id);
  }

  @Patch(':id')
  @Admin()
  update(@Param('id') id: string, @Body() updateResultDetailDto: UpdateResultDetailDto) {
    return this.resultDetailService.update(+id, updateResultDetailDto);
  }

  @Delete(':id')
  @Admin()
  remove(@Param('id') id: string) {
    return this.resultDetailService.remove(+id);
  }
}
