import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Admin, Public, User } from 'src/decorator/customize';
import { use } from 'passport';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Public()
  // @Post()
  // create(@Body() createUserDTO: CreateUserDto) {
  //   return this.usersService.register(createUserDTO);
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('/user')
  getInfo(@User() user: IUser) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @User() user) {
    return this.usersService.update(+id, user);
  }

  @Delete(':id')
  @Admin()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
