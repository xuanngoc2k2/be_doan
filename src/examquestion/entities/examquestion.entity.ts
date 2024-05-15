import { Exam } from "src/exams/entities/exam.entity";
import { Group_Question } from "src/group_question/entities/group_question.entity";
import { Question } from "src/question/entities/question.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ExamQuestion {
    @PrimaryColumn()
    examId: number;

    @PrimaryColumn()
    questionId: number;

    @ManyToOne(() => Exam, (exam) => exam.examQuestions)
    exam: Exam

    @ManyToOne(() => Question, (question) => question.examQuestions)
    question: Question

    // @DeleteDateColumn()
    // deletedAt: Date;
}
