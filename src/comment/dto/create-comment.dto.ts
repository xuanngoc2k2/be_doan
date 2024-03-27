import { IsNotEmpty, isNotEmpty } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty({ message: "Comment không được để trống" })
    comment: string;

    commentAt: string;

    @IsNotEmpty({ message: "LessonId không được để trống" })
    lessonId: number
}
