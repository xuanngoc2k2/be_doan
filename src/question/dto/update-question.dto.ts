import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import { IsNotEmpty } from 'class-validator';
import { Answer } from 'src/answer/entities/answer.entity';
import { Group_Question } from 'src/group_question/entities/group_question.entity';

export class UpdateQuestionDto {
    @IsNotEmpty({ message: 'Question không được để trống' })
    question: string;

    // @IsNumber({}, { message: 'Level phải là số' })
    // @Min(1, { message: 'Level ít nhất là 1' })
    // @Max(5, { message: 'Level lớn nhất là 5' })
    level: number;

    answers?: Answer[];
    // @IsNumber({}, { message: 'Score phải là số' })
    // @Min(0, { message: 'Score ít nhất phải là 0' })
    score: number;

    group_question?: Group_Question;

    group_questionId: number;

}
