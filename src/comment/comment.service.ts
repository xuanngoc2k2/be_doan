import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>
  ) { }

  async create(createCommentDto: CreateCommentDto, user: IUser) {
    console.log(createCommentDto);
    const lesson = await this.lessonRepo.findOne({ where: { id: createCommentDto.lessonId } });
    if (lesson === null) {
      throw new BadRequestException("Không tìm thấy bài học");
    }
    //xem xét hạn chế comment vi phạm
    const newComment = await this.commentRepo.create({ ...createCommentDto, user: user, lesson: lesson });
    return this.commentRepo.save(newComment);
  }

  getAllNote = async (lessonId: number, user: IUser, isComment?: boolean) => {
    if (isComment) {
      return await this.commentRepo
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .where('comment.lessonId =:lessonId', { lessonId })
        .andWhere("comment.commentAt IS NULL")
        .select(['comment', 'user.full_name', 'user.image'])
        .getMany();
    }
    return await this.commentRepo.find({
      where: {
        lessonId,
        user,
        commentAt: Not(IsNull()) // Use Not(IsNull()) to check for non-null values
      },
      order: {
        commentAt: "ASC" // or "DESC" for descending order
      }
    });
  };



  async findAll() {
    return await this.commentRepo.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: IUser) {
    const lesson = await this.lessonRepo.findOne({ where: { id: updateCommentDto.lessonId } });
    if (lesson === null) {
      throw new BadRequestException("Không tìm thấy bài học");
    }
    if (!await this.commentRepo.findOne({ where: { id, user } })) {
      throw new NotFoundException("Không tìm thấy comment này");
    }
    const updateComment = await this.commentRepo.update({ id }, { ...updateCommentDto });
    if (updateComment.affected === 0) {
      throw new BadRequestException("Update lỗi");
    }
    return { success: true };
  }

  async remove(id: number) {
    if (!await this.commentRepo.findOne({ where: { id } })) {
      throw new NotFoundException("Không tìm thấy comment");
    }
    const deleteC = await this.commentRepo.softDelete({ id });
    if (deleteC.affected === 0) {
      throw new BadRequestException("Delete lỗi");
    }
    return { success: true };
  }
}
