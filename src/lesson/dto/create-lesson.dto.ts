import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { Course } from 'src/course/entities/course.entity';

export class CreateLessonDto {
    @IsNotEmpty({ message: 'Tên bài học không được để trống' })
    @IsString({ message: 'Tên bài học phải là chuỗi' })
    lesson_name: string;

    content: string;

    description: string;

    @IsNotEmpty({ message: 'ID của khóa học không được để trống' })
    courseId: number;

    course?: Course;

    isQuestion: boolean;

    thumbnail: string;

    order: number;

    questionId: number;
}
