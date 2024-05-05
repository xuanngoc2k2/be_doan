import { IsNotEmpty } from "class-validator";
import { Course } from "src/course/entities/course.entity";

export class CreateVocabularyDto {

    // @IsNotEmpty({ message: "Word không được để trống" })
    word: string;

    // @IsNotEmpty({ message: "Meaning không được để trống" })
    meaning: string;

    image?: string;

    example?: string;

    courseId?: number;

    partOfSpeech: string;

    level: number;

    spell: string;

    course?: Course;
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

