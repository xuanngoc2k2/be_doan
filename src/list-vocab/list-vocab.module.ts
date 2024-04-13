import { Module } from '@nestjs/common';
import { ListVocabService } from './list-vocab.service';
import { ListVocabController } from './list-vocab.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListVocab } from './entities/list-vocab.entity';
import { User_Vocabulary } from 'src/user_vocabulary/entities/user_vocabulary.entity';
import { Vocabulary } from 'src/vocabularys/entities/vocabulary.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListVocab, Vocabulary, User])],
  controllers: [ListVocabController],
  providers: [ListVocabService],
})
export class ListVocabModule { }
