import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString({ message: "Tên khóa học phải là string" })
    @IsNotEmpty({ message: "Không được để trống !" })
    course_name: string;

    @IsString({ message: "Tên khóa học phải là string" })
    description: string;

    @IsNotEmpty({ message: "Không được để trống !" })
    @IsNumber({}, { message: "Level Required phải là số nguyên !!" })
    level_required: number;
}
