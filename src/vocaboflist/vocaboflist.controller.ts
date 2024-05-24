import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VocaboflistService } from './vocaboflist.service';
import { CreateVocaboflistDto } from './dto/create-vocaboflist.dto';
import { UpdateVocaboflistDto } from './dto/update-vocaboflist.dto';

@Controller('vocaboflist')
export class VocaboflistController {
  constructor(private readonly vocaboflistService: VocaboflistService) {}

  @Post()
  create(@Body() createVocaboflistDto: CreateVocaboflistDto) {
    return this.vocaboflistService.create(createVocaboflistDto);
  }

  @Get()
  findAll() {
    return this.vocaboflistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocaboflistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVocaboflistDto: UpdateVocaboflistDto) {
    return this.vocaboflistService.update(+id, updateVocaboflistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocaboflistService.remove(+id);
  }
}
