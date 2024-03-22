import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExamsModule } from './exams/exams.module';
import { NewsModule } from './news/news.module';
import { VocabularysModule } from './vocabularys/vocabularys.module';
import { CommentModule } from './comment/comment.module';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { ResultModule } from './result/result.module';
import { ResultDetailModule } from './result_detail/result_detail.module';
import { UserCourseModule } from './user_course/user_course.module';
import { UserLessonModule } from './user_lesson/user_lesson.module';
import { UserVocabularyModule } from './user_vocabulary/user_vocabulary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ExamsModule,
    NewsModule,
    VocabularysModule,
    CommentModule,
    CourseModule,
    LessonModule,
    QuestionModule,
    AnswerModule,
    ResultModule,
    ResultDetailModule,
    UserCourseModule,
    UserLessonModule,
    UserVocabularyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
