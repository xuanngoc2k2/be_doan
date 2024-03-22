import { Exam } from 'src/exams/entities/exam.entity';
import { Question } from 'src/question/entities/question.entity';
import { Result } from 'src/result/entities/result.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Result_Detail {
    @PrimaryColumn()
    resultId: number;

    @PrimaryColumn()
    questionId: number;

    @Column({ nullable: false })
    user_answer: number;

    @Column({ nullable: false })
    is_correct: number;

    @ManyToOne(() => Result, (result) => result.result_details)
    result: Result

    @ManyToOne(() => Question, (question) => question.result_details)
    question: Question

}
