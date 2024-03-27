import { IsNotEmpty } from "class-validator";

export class CreateVocabularyDto {

    @IsNotEmpty({ message: "Word không được để trống" })
    word: string;

    @IsNotEmpty({ message: "Meaning không được để trống" })
    meaning: string;

    image?: string;

    example?: string;

    lessonId?: number;
}
