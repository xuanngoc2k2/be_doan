import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  findAll() {
    return this.userVocabularyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userVocabularyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserVocabularyDto: UpdateUserVocabularyDto) {
    return this.userVocabularyService.update(+id, updateUserVocabularyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userVocabularyService.remove(+id);
  }
}
