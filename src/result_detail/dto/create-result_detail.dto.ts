import { IsNotEmpty } from "class-validator";

export class CreateResultDetailDto {
    @IsNotEmpty({ message: "ResultId không được bỏ trống" })
    resultId: number;

    @IsNotEmpty({ message: "QuestionId không được bỏ trống" })
    questionId: number;

    @IsNotEmpty({ message: "User_Answer không được bỏ trống" })
    user_answer: string;
}
