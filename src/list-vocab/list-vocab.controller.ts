import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListVocabService } from './list-vocab.service';
import { CreateListVocabDto } from './dto/create-list-vocab.dto';
import { UpdateListVocabDto } from './dto/update-list-vocab.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('list-vocab')
export class ListVocabController {
  constructor(private readonly listVocabService: ListVocabService) { }

  @Post()
  @ResponseMessage("Tạo mới list từ")
  create(@Body() createListVocabDto: CreateListVocabDto, @User() user: IUser) {
    return this.listVocabService.create(createListVocabDto, user);
  }

  @Get()
  @ResponseMessage("Get all list từ")
  findAll(@User() user: IUser) {
    return this.listVocabService.findAll(user);
  }

  @Post('course')
  @ResponseMessage("Get list vocab with course")
  getVocabWithCourse() {
    return this.listVocabService.getVocabWithCourse();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: IUser) {
    return this.listVocabService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListVocabDto: UpdateListVocabDto) {
    return this.listVocabService.update(+id, updateListVocabDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listVocabService.remove(+id);
  }
}
