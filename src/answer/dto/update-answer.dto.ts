import { PartialType } from '@nestjs/mapped-types';
import { CreateAnswerDto } from './create-answer.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateAnswerDto {
    @IsNotEmpty({ message: "Answer không được để trống" })
    answer: string;

    explain?: string;

    isImage?: boolean;
}
