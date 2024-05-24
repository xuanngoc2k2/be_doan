import { Module } from '@nestjs/common';
import { VocabularysService } from './vocabularys.service';
import { VocabularysController } from './vocabularys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Course } from 'src/course/entities/course.entity';
import { Vocaboflist } from 'src/vocaboflist/entities/vocaboflist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary, Vocaboflist])],
  controllers: [VocabularysController],
  providers: [VocabularysService],
  exports: [VocabularysService]
})
export class VocabularysModule { }
