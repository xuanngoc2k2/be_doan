import { Comment } from 'src/comment/entities/comment.entity';
import { Course } from 'src/course/entities/course.entity';
import { Question } from 'src/question/entities/question.entity';
import { User_Lesson } from 'src/user_lesson/entities/user_lesson.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    lesson_name: string;

    @Column({ nullable: false, type: 'longtext' })
    content: string;

    @Column({ type: 'longtext' })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Course, (course) => course.lessons)
    course: Course

    // @OneToMany(() => Question, (question) => question.lesson)
    // questions: Question[]

    @OneToMany(() => User_Lesson, (user_lesson) => user_lesson.lesson)
    user_lessons: User_Lesson[]

    @OneToMany(() => Comment, (comment) => comment.lesson)
    comments: Comment[]
}
