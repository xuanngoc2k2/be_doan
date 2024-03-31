import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Exam } from 'src/exams/entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Exam])],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule { }
