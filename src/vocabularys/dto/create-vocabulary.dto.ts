import { IsNotEmpty } from "class-validator";

export class CreateVocabularyDto {

    // @IsNotEmpty({ message: "Word không được để trống" })
    word: string;

    // @IsNotEmpty({ message: "Meaning không được để trống" })
    meaning: string;

    image?: string;

    example?: string;

    lessonId?: number;

    partOfSpeech: string;

    level: number;

    spell: string;
}

export class Answer {

    meaning: {
        id: number,
        meaning: string,
        spell: string,
        partOfSpeech: string
    };

    ans: string[];

    answer: string;
}

