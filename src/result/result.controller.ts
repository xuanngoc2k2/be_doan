import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Admin, Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) { }

  @Post()
  // @Admin()
  @ResponseMessage("Create new result")
  create(@Body('examId') examId: number,
    @Body('result') result: Object[], @User() user: IUser) {
    return this.resultService.create({ examId, result }, user);
  }

  @Get()
  @ResponseMessage("Get all user's result")
  findAll(@User() user: IUser) {
    return this.resultService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: IUser) {
    return this.resultService.findOne(+id, user);
  }

  @Post('ranking')
  @Public()
  ranking() {
    return this.resultService.findRanking();
  }

  @Patch(':id')
  @ResponseMessage("Update result")
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultService.update(+id, updateResultDto);
  }

  @ResponseMessage("Delete result")
  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultService.remove(+id);
  }
}
