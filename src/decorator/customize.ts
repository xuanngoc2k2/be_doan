import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { IUser } from 'src/users/users.interface';



export const IS_PUBLIC_KEY = 'isPublic';
export const IS_ADMIN = 'isAdmin';
export const IS_USER = 'isUser';
export const RESPONSE_MESSAGE = 'response_message';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const UserRole = () => SetMetadata(IS_USER, true);
export const Admin = () => SetMetadata(IS_ADMIN, true);


export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE, message);


export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
)