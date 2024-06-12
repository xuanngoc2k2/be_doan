import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ListVocabService } from './list-vocab.service';
import { CreateListVocabDto } from './dto/create-list-vocab.dto';
import { UpdateListVocabDto } from './dto/update-list-vocab.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('list-vocab')
export class ListVocabController {
  constructor(private readonly listVocabService: ListVocabService) { }

  @Post()
  @ResponseMessage("Tạo mới list từ")
  create(@Body() createListVocabDto: Object, @User() user: IUser) {
    return this.listVocabService.create(createListVocabDto as CreateListVocabDto, user);
  }


  @Post('copy')
  @ResponseMessage("Copy list")
  copy(
    // @Body('idList') idList,
    @Body('idList') idList: string,
    @User() user: IUser,
    @Body('name') name?: string,
    @Body('des') des?: string,
  ) {
    return this.listVocabService.copy(+idList, user, name, des);
  }


  @Post('/all')
  @Public()
  @ResponseMessage("Get all list từ")
  findAll(
    @Body('user') user?: IUser,
    @Query('search') search?: string
  ) {
    return this.listVocabService.findAll(user, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: IUser) {
    return this.listVocabService.findOne(+id, user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateListVocabDto: Object) {
    return this.listVocabService.update(+id, updateListVocabDto as UpdateListVocabDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listVocabService.remove(+id);
  }
}
