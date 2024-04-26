import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import * as ms from 'ms'
import { CreateUserDto } from 'src/users/dto/create-user.dto';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    //gọi khi login
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user && this.usersService.isValidPassword(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    //gọi khi login thành công
    async login(user: IUser, response: Response) {
        const { id, username, email, role, image } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            id,
            username,
            email,
            role,
            image
        };
        const refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateRefreshToken(refresh_token, id);

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")),
        });
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id,
                username,
                email,
                role,
                image
            }
        };
    }
    register = async (user: CreateUserDto) => {
        let a = await this.usersService.register(user);
        return {
            id: a?.id,
            username: a?.username
        }
    }
    refreshNewToken = async (refresh_token: string, response) => {
        try {
            this.jwtService.verify(refresh_token, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            })
            let user = await this.usersService.findUserByToken(refresh_token);
            if (user) {
                const { id, username, email, role, image } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    id,
                    username,
                    email,
                    role,
                    image
                };


                const refresh_token = this.createRefreshToken(payload);
                await this.usersService.updateRefreshToken(refresh_token, id);

                response.clearCookie('refresh_token');
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")),
                });
                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        id,
                        username,
                        email,
                        role,
                        image
                    }
                };
            }
            else {
                throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login !!");
            }
        } catch (error) {
            throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login !!");
        }
    }

    createRefreshToken = (payload) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE")
        });
        return refresh_token;
    }

    logout = async (user: IUser, response: Response) => {
        await this.usersService.updateRefreshToken("", user.id);
        response.clearCookie('refresh_token');
        return "ok";
    }
}

