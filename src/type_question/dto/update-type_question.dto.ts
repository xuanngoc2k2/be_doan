import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeQuestionDto } from './create-type_question.dto';

export class UpdateTypeQuestionDto extends PartialType(CreateTypeQuestionDto) {}
