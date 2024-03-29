import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupQuestionDto } from './create-group_question.dto';

export class UpdateGroupQuestionDto extends PartialType(CreateGroupQuestionDto) {}
