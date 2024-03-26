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

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // app.useGlobalGuards(new LocalAuthGuard);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector))
  app.useGlobalPipes(new ValidationPipe());


  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs')
  app.use(cookieParser());
  await app.listen(configService.get<number>("PORT"));
}
bootstrap();
