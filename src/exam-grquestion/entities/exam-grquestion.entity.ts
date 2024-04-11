import { Exam } from "src/exams/entities/exam.entity";
import { Group_Question } from "src/group_question/entities/group_question.entity";
import { Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ExamGrquestion {
    @PrimaryColumn()
    examId: number;

    @PrimaryColumn()
    groupQuestionId: number;

    @ManyToOne(() => Exam, (exam) => exam.examGrquestions)
    exam: Exam

    @ManyToOne(() => Group_Question, (group_question) => group_question.exgroupQueston)
    groupQuestion: Group_Question
}
