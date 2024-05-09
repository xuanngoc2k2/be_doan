import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Search } from '@nestjs/common';
import { VocabularysService } from './vocabularys.service';
import { Answer, CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Admin, Public, ResponseMessage } from 'src/decorator/customize';

@Controller('vocabularys')
export class VocabularysController {
  constructor(private readonly vocabularysService: VocabularysService) { }

  @Post()
  @ResponseMessage("Tạo mới từ vựng")
  create(@Body() createVocabularyDto: CreateVocabularyDto) {
    return this.vocabularysService.create(createVocabularyDto);
  }

  @Post('checkResult')
  @ResponseMessage("Submit result question vocab")
  checkResult(@Body() listAnswer: Answer[]) {
    return this.vocabularysService.checkAnswer(listAnswer);
  }


  @Get()
  @ResponseMessage("Get all Vocabulary")
  findAll() {
    return this.vocabularysService.findAll();
  }

  @Post('/search')
  @ResponseMessage("Get all vocabulary")
  getAllVocab(
    @Body('id') id?: number,
    @Body('word') word?: string,
    @Body('level') level?: string[],
    @Body('meaning') meaning?: string,
  ) {
    return this.vocabularysService.findAll(id, word, meaning, level);
  }

  @Post('userSearch')
  @Public()
  @ResponseMessage("Search vocab")
  getVocab(
    @Body('search') search?: string,
  ) {
    return this.vocabularysService.search(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabularysService.findOne(+id);
  }

  @Put(':id')
  @Admin()
  update(@Param('id') id: string, @Body() updateVocabularyDto: UpdateVocabularyDto) {
    return this.vocabularysService.update(+id, updateVocabularyDto);
  }

  @Post('courses')
  @Public()
  getAllVocabCourse(@Body('id') id?: number) {
    return this.vocabularysService.getVocabByIdCourse(id);
  }

  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabularysService.remove(+id);
  }
}
