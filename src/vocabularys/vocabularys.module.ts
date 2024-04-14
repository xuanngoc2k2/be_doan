import { Module } from '@nestjs/common';
import { VocabularysService } from './vocabularys.service';
import { VocabularysController } from './vocabularys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary, Lesson])],
  controllers: [VocabularysController],
  providers: [VocabularysService],
  exports: [VocabularysService]
})
export class VocabularysModule { }
