import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VocabularysService } from './vocabularys.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Admin, ResponseMessage } from 'src/decorator/customize';

@Controller('vocabularys')
export class VocabularysController {
  constructor(private readonly vocabularysService: VocabularysService) { }

  @Post()
  @ResponseMessage("Tạo mới từ vựng")
  @Admin()
  create(@Body() createVocabularyDto: CreateVocabularyDto) {
    return this.vocabularysService.create(createVocabularyDto);
  }

  @Get()
  @ResponseMessage("Get all Vocabulary")
  findAll() {
    return this.vocabularysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabularysService.findOne(+id);
  }

  @Patch(':id')
  @Admin()
  update(@Param('id') id: string, @Body() updateVocabularyDto: UpdateVocabularyDto) {
    return this.vocabularysService.update(+id, updateVocabularyDto);
  }

  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabularysService.remove(+id);
  }
}
