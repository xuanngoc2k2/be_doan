import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class CreateAnswerDto {
    @IsNotEmpty({ message: "Answer không được để trống" })
    answer: string;

    @IsNotEmpty({ message: "Is_true không được để trống" })
    @Transform(({ value }) => value == 'true')
    @IsBoolean({ message: "Phải là kiểu boolean" })
    is_true: boolean;

    explain: string;

    @IsNotEmpty({ message: "QuestionId không được để trống" })
    questionId: number;
}
