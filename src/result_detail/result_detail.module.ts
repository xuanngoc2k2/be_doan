import { Module } from '@nestjs/common';
import { ResultDetailService } from './result_detail.service';
import { ResultDetailController } from './result_detail.controller';

@Module({
  controllers: [ResultDetailController],
  providers: [ResultDetailService],
})
export class ResultDetailModule {}
