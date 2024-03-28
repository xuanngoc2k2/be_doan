import { Module } from '@nestjs/common';
import { UserVocabularyService } from './user_vocabulary.service';
import { UserVocabularyController } from './user_vocabulary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from 'src/vocabularys/entities/vocabulary.entity';
import { User_Vocabulary } from './entities/user_vocabulary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary, User_Vocabulary])],
  controllers: [UserVocabularyController],
  providers: [UserVocabularyService],
})
export class UserVocabularyModule { }
