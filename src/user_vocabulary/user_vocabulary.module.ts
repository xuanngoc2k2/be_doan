import { Module } from '@nestjs/common';
import { UserVocabularyService } from './user_vocabulary.service';
import { UserVocabularyController } from './user_vocabulary.controller';

@Module({
  controllers: [UserVocabularyController],
  providers: [UserVocabularyService],
})
export class UserVocabularyModule {}
