import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ResponseMessage, User, UserRole } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  // @UserRole
  @ResponseMessage("Viết Comment")
  create(@Body('comment') comment: string
    , @User() user: IUser,
    @Body('lessonId') lessonId: number,
    @Body('commentAt') commentAt?: string,
  ) {
    return this.commentService.create({ comment, lessonId, commentAt } as CreateCommentDto, user);
  }

  @Post('getAllNote')
  // @UserRole
  @ResponseMessage("Get All Note")
  getAllNote(@Body('lessonId') lessonId: number,
    @User() user: IUser,
    @Body('isComment') isComment?: boolean
  ) {
    return this.commentService.getAllNote(lessonId, user, isComment);
  }

  // @Post('getAllComment')
  // // @UserRole
  // @ResponseMessage("Get All Note")
  // getAllNote(@Body('lessonId') lessonId: number, @User() user: IUser) {
  //   return this.commentService.getAllNote(lessonId, user);
  // }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @User() user: IUser) {
    return this.commentService.update(+id, updateCommentDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
