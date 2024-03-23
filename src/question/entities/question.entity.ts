import { Answer } from 'src/answer/entities/answer.entity';
import { Exam } from 'src/exams/entities/exam.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Result_Detail } from 'src/result_detail/entities/result_detail.entity';
import { Type_Question } from 'src/type_question/entities/type_question.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, LessThan, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    question: string;

    @Column({ nullable: false })
    level: number;

    @Column({ nullable: false })
    type: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[]

    @ManyToOne(() => Lesson, (lesson) => lesson.questions)
    lesson: Lesson

    @ManyToOne(() => Exam, (exam) => exam.questions)
    exam: Exam

    @ManyToOne(() => Type_Question, (type_question) => type_question.questions)
    type_question: Type_Question

    @OneToMany(() => Result_Detail, (result_detail) => result_detail.question)
    result_details: Result_Detail[]
}
