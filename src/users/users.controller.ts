import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Admin, Public, User } from 'src/decorator/customize';
import { use } from 'passport';
import { IUser } from './users.interface';
import { User as UserE } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Public()
  // @Post()
  // create(@Body() createUserDTO: CreateUserDto) {
  //   return this.usersService.register(createUserDTO);
  // }

  @Get()
  @Admin()
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

  @Post('/updatePass')
  updatePass(
    @Body('pass') pass: string,
    @Body('newPass') newPass: string,
    @User() user: IUser
  ) {
    return this.usersService.updatePass(pass, newPass, user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body('user') user: UserE) {
    return this.usersService.update(+id, user);
  }

  @Delete(':id')
  @Admin()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
