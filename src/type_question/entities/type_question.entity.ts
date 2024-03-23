import { Answer } from 'src/answer/entities/answer.entity';
import { Exam } from 'src/exams/entities/exam.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Question } from 'src/question/entities/question.entity';
import { Result_Detail } from 'src/result_detail/entities/result_detail.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, LessThan, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Type_Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    score: number;

    @Column({ nullable: false })
    type: string;

    @OneToMany(() => Question, (question) => question.type_question)
    questions: Question[]

    @ManyToOne(() => Exam, (exam) => exam.type_questions)
    exam: Exam
}
