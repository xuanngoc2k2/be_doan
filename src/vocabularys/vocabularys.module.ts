import { Module } from '@nestjs/common';
import { VocabularysService } from './vocabularys.service';
import { VocabularysController } from './vocabularys.controller';

@Module({
  controllers: [VocabularysController],
  providers: [VocabularysService],
})
export class VocabularysModule {}
