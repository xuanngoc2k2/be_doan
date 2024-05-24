import { PartialType } from '@nestjs/mapped-types';
import { CreateUserListDto } from './create-user_list.dto';

export class UpdateUserListDto extends PartialType(CreateUserListDto) {}
