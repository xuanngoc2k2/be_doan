import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
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
    async login(user: IUser) {
        const { id, username, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            id,
            username,
            email,
            role
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id,
                username,
                email,
                role
            }
        };
    }
}
