import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Exam } from 'src/exams/entities/exam.entity';
import { Result_Detail } from 'src/result_detail/entities/result_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Exam, Result_Detail])],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule { }
