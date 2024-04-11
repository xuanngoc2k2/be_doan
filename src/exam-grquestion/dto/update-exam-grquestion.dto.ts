import { PartialType } from '@nestjs/mapped-types';
import { CreateExamGrquestionDto } from './create-exam-grquestion.dto';

export class UpdateExamGrquestionDto extends PartialType(CreateExamGrquestionDto) {}
