import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString({ message: "Tên khóa học phải là string" })
    @IsNotEmpty({ message: "Tên khóa học không được để trống !" })
    course_name: string;

    @IsString({ message: "Mô tả phải là string" })
    description: string;

    @IsNotEmpty({ message: "Level Required được để trống !" })
    // @IsInt({ message: "Level Required phải là số nguyên !!" })
    level_required: number;

    @IsNotEmpty({ message: "Image được để trống !" })
    image: string;
}
