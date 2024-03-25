import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @Post('/login')
    @UseGuards(LocalAuthGuard)
    @ResponseMessage("Đăng nhập")
    handleLogin(@Req() req
        , @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Post('/register')
    @Public()
    @ResponseMessage("Đăng kí người dùng mới")
    handleRegister(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Get('/account')
    @ResponseMessage("Lấy thông tin User")
    handleGetAccount(@User() user: IUser) {
        return { user };
    }

    @Get('/refresh')
    @ResponseMessage("Refresh token User")
    @Public()
    handleRefreshToken(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = req.cookies["refresh_token"];
        return this.authService.refreshNewToken(refreshToken, response);
    }

    @Get('/logout')
    @ResponseMessage("Logout User")
    handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
        return this.authService.logout(user, response);
    }

}
