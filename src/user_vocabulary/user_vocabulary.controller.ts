import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserVocabularyService } from './user_vocabulary.service';
import { CreateUserVocabularyDto } from './dto/create-user_vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user_vocabulary.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('user-vocabulary')
export class UserVocabularyController {
  constructor(private readonly userVocabularyService: UserVocabularyService) { }

  @Post()
  @ResponseMessage("Thêm/Lưu từ mới vào yêu thích")
  create(@Body('vocabularyId') vocabularyId: string, @User() user: IUser) {
    return this.userVocabularyService.create(+vocabularyId, user);
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

  @Delete()
  remove(@Body('vocabularyId') vocabularyId: string,
    @User() user: IUser) {
    return this.userVocabularyService.remove(+vocabularyId, user);
  }
}
