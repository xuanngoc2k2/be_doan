import { IsIn, IsNotEmpty, isNotEmpty } from "class-validator";

export class CreateGroupQuestionDto {
    description: string;

    @IsNotEmpty({ message: "Content không được để trống" })
    content: string;

    @IsIn(['Reading', 'Listening'], { message: 'Type phải là Reading hoặc Listening' })
    type: string;

    image: string;
}
