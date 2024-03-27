import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  @ResponseMessage("Tạo mới thông báo")
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @Public()
  @ResponseMessage("Lấy thông tin tất cả thông báo")
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  @ResponseMessage("Lấy thông tin thông báo")
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage("Cập nhật thông tin thông báo")
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
