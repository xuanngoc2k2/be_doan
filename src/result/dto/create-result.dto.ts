import { IsNotEmpty } from "class-validator";

export class CreateResultDto {
    examId: number;

    result: Object[];
}
