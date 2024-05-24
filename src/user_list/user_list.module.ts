import { Module } from '@nestjs/common';
import { UserListService } from './user_list.service';
import { UserListController } from './user_list.controller';

@Module({
  controllers: [UserListController],
  providers: [UserListService],
})
export class UserListModule {}
