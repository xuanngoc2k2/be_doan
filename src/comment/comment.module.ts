import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Lesson])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }
