import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserVocabularyService } from './user_vocabulary.service';
import { CreateUserVocabularyDto } from './dto/create-user_vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user_vocabulary.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreateVocabularyDto } from 'src/vocabularys/dto/create-vocabulary.dto';

@Controller('user-vocabulary')
export class UserVocabularyController {
  constructor(private readonly userVocabularyService: UserVocabularyService) { }

  @Post('/:idList')
  @ResponseMessage("Thêm/Lưu từ mới list")
  create(@Param('idList') idList, @Body() vocabulary: CreateVocabularyDto, @User() user: IUser) {
    return this.userVocabularyService.create(idList, vocabulary, user);
  }

  @Get()
  @ResponseMessage("Tìm tất cả từ mới của người dùng")
  findAll(@User() user: IUser) {
    return this.userVocabularyService.findAll(user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string, @User() user: IUser) {
  //   return this.userVocabularyService.findOne(+id, user);
  // }

  @Put()
  update(
    @Body('vocabularyId') vocabularyId: string,
    @Body('isRemember') isRemember: number,
    @User() user: IUser
  ) {
    return this.userVocabularyService.update(+vocabularyId, +isRemember, user);
  }

  @Post('remove/:vocabularyId/:listId')
  delete(
    @Param('vocabularyId') vocabularyId: string,
    @Param('listId') listId: string,
  ) {
    // Xử lý logic ở đây, sử dụng body để truyền dữ liệu
    return this.userVocabularyService.remove(+vocabularyId, +listId);
  }

  @Post('updateRemember/:vocabularyId/:listId')
  updateRemember(
    @Param('vocabularyId') vocabularyId: string,
    @Param('listId') listId: string,
  ) {
    // Xử lý logic ở đây, sử dụng body để truyền dữ liệu
    return this.userVocabularyService.updateRemember(+vocabularyId, +listId);
  }

  @Delete(':vocabularyId/:listId')
  remove(
    @Param('vocabularyId') vocabularyId: string,
    @Param('listId') listId: string
    // @Body('vocabularyId') vocabularyId: string,
    // @Body('listId') listId: string
  ) {
    return this.userVocabularyService.remove(+vocabularyId, +listId);
  }
}
