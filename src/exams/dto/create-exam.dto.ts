import { Transform } from "class-transformer";
import { IsDate, IsIn, IsNotEmpty } from "class-validator";

export class CreateExamDto {
    @IsNotEmpty({ message: "Tên exam không được để trống" })
    exam_name: string;

    id?: number;

    description: string;

    @IsNotEmpty({ message: "Duration không được để trống" })
    duration: number;

    @IsNotEmpty({ message: "startAt không được để trống" })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "startAt có định dạng là Date" })
    startAt: Date;

    @IsNotEmpty({ message: "endAt không được để trống" })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "endAt có định dạng là Date" })
    endAt: Date;

    @IsIn(['TOPIK I', 'TOPIK II', 'EPS'], { message: 'Type phải là TOPIK I, TOPIK II hoặc EPS' })
    type: string;
}
