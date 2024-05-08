// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { ExamGrquestionService } from './exam-grquestion.service';
// import { CreateExamGrquestionDto } from './dto/create-exam-grquestion.dto';
// import { UpdateExamGrquestionDto } from './dto/update-exam-grquestion.dto';

// @Controller('exam-grquestion')
// export class ExamGrquestionController {
//   constructor(private readonly examGrquestionService: ExamGrquestionService) {}

//   @Post()
//   create(@Body() createExamGrquestionDto: CreateExamGrquestionDto) {
//     return this.examGrquestionService.create(createExamGrquestionDto);
//   }

//   @Get()
//   findAll() {
//     return this.examGrquestionService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.examGrquestionService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateExamGrquestionDto: UpdateExamGrquestionDto) {
//     return this.examGrquestionService.update(+id, updateExamGrquestionDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.examGrquestionService.remove(+id);
//   }
// }
