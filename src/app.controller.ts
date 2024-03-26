import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
  ) { }

  // @Public()
  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // handleLogin(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  @Public()
  @Get()
  @Render('home')
  getProfile() {
    // return req.user;
  }

  // @Get('profile11')
  // getProfile1(@Request() req) {
  //   return "req.user";
  // }
}
