import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Admin, Public, ResponseMessage } from 'src/decorator/customize';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  @Admin()
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

  @Post('search')
  @Public()
  @ResponseMessage("Lấy thông tin tất cả thông báo")
  searchNew(@Body('search') search: string) {
    return this.newsService.findAll(search);
  }

  @Get(':id')
  @ResponseMessage("Lấy thông tin thông báo")
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Put(':id')
  @Admin()
  @ResponseMessage("Cập nhật thông tin thông báo")
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  @Admin()
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
