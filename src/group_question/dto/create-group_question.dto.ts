import { IsNotEmpty, isNotEmpty } from "class-validator";

export class CreateGroupQuestionDto {
    description: string;

    @IsNotEmpty({ message: "Content không được để trống" })
    content: string;

    image: string;
}
