import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) { }

  @Post()
  @ResponseMessage("Create new result")
  create(@Body() createResultDto: CreateResultDto, @User() user: IUser) {
    return this.resultService.create(createResultDto, user);
  }

  @Get()
  @ResponseMessage("Get all user's result")
  findAll(@User() user: IUser) {
    return this.resultService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultService.update(+id, updateResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultService.remove(+id);
  }
}
