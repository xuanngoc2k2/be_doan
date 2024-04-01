import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_ADMIN, IS_PUBLIC_KEY, IS_USER } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        //check quyền
        const requiredRolesAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN, [
            context.getHandler(),
            context.getClass(),
        ]);
        const requiredRolesUser = this.reflector.getAllAndOverride<boolean>(IS_USER, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (requiredRolesAdmin) {
            // Kiểm tra quyền Admin
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!(user && user.role === 'ADMIN')) {
                throw new ForbiddenException("Chỉ admin mới được dùng request này");
            }
            return true
        }

        if (requiredRolesUser) {
            // Kiểm tra quyền User
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            return user && user.role === 'USER';
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Token không hợp lệ");
        }
        return user;
    }
}
