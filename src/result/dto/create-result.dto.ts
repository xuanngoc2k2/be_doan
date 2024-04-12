import { IsNotEmpty } from "class-validator";

export class CreateResultDto {
    // score: number;

    // @IsNotEmpty({ message: "ExamId không được để trống" })
    examId: number;

    // @IsNotEmpty()
    result: Object[];
}
