import { IsNotEmpty } from "class-validator";

export class CreateNewsDto {
    @IsNotEmpty({ message: "Content không được để trống" })
    content: string;

    image: string;
}
