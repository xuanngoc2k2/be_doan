import { PartialType } from '@nestjs/mapped-types';
import { CreateExamQuestionDto } from './create-examquestion.dto';

export class UpdateExamQuestionDto extends PartialType(CreateExamQuestionDto) { }
