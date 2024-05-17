import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './decorator/transform.interceptor';
import * as cookieParser from 'cookie-parser';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const allowedOrigins = [
    'http://localhost:5173',
    'https://www.googleapis.com',
    'https://accounts.google.com',
    'https://apis.google.com',
    // thêm các miền khác nếu cần
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Nếu bạn cần hỗ trợ đăng nhập từ nguồn khác
  }));
  // app.use(cors({
  //   origin: 'http://localhost:5173',
  //   credentials: true, // Nếu bạn cần hỗ trợ đăng nhập từ nguồn khác
  // }));
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // app.useGlobalGuards(new LocalAuthGuard);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector))
  app.useGlobalPipes(new ValidationPipe(
    { whitelist: true }
  ));


  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs')
  app.use(cookieParser());

  await app.listen(configService.get<number>("PORT"));
}
bootstrap();
