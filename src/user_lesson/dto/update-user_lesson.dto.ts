import { PartialType } from '@nestjs/mapped-types';
import { CreateUserLessonDto } from './create-user_lesson.dto';

export class UpdateUserLessonDto extends PartialType(CreateUserLessonDto) {}
