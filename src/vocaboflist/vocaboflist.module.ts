import { Module } from '@nestjs/common';
import { VocaboflistService } from './vocaboflist.service';
import { VocaboflistController } from './vocaboflist.controller';

@Module({
  controllers: [VocaboflistController],
  providers: [VocaboflistService],
})
export class VocaboflistModule {}
