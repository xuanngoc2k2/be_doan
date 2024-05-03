import { IsIn, IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class CreateQuestionDto {
    @IsNotEmpty({ message: 'Question không được để trống' })
    question: string;

    // @IsNumber({}, { message: 'Level phải là số' })
    // @Min(1, { message: 'Level ít nhất là 1' })
    // @Max(5, { message: 'Level lớn nhất là 5' })
    level: number;

    @IsIn(['multiple-choice', 'fill'], { message: 'Type phải là multiple-choice hoặc fill' })
    type: string;

    // @IsNumber({}, { message: 'Score phải là số' })
    // @Min(0, { message: 'Score ít nhất phải là 0' })
    score: number;

    group_questionId: number;

    // lessonId: number;
}
