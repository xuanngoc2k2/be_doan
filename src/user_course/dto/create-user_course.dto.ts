import { IsNotEmpty } from "class-validator";

export class CreateUserCourseDto {
    @IsNotEmpty({ message: "CourseId không được để trống" })
    courseId: number;
}
