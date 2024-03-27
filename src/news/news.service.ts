import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { Public } from 'src/decorator/customize';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newRepo: Repository<News>
  ) {

  }
  async create(createNewsDto: CreateNewsDto) {
    const newNews = await this.newRepo.create({ ...createNewsDto });
    return await this.newRepo.save(newNews);
  }

  async findAll() {
    return await this.newRepo.find({});
  }

  async findOne(id: number) {
    return await this.newRepo.find({ where: { id } });
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const updateNews = await this.newRepo.update({ id }, { ...updateNewsDto });
    if (updateNews.affected === 0) {
      throw new BadRequestException("Lỗi update");
    }
    return { success: true };
  }

  async remove(id: number) {
    const news = await this.newRepo.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException('Không tìm thấy tin tức');
    }
    const deleteNews = await this.newRepo.softDelete({ id });
    if (deleteNews.affected === 0) {
      throw new BadRequestException("Lỗi xóa");
    }
    return { success: true };
  }
}
