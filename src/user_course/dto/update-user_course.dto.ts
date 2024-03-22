import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCourseDto } from './create-user_course.dto';

export class UpdateUserCourseDto extends PartialType(CreateUserCourseDto) {}
