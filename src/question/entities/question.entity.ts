import { Answer } from 'src/answer/entities/answer.entity';
import { ExamQuestion } from 'src/examquestion/entities/examquestion.entity';
import { Exam } from 'src/exams/entities/exam.entity';
import { Group_Question } from 'src/group_question/entities/group_question.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Result_Detail } from 'src/result_detail/entities/result_detail.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, LessThan, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    question: string;

    @Column({ nullable: true, default: 0 })
    level: number;

    @Column({ nullable: false })
    type: string;

    @Column({ nullable: false })
    score: number;

    @Column({ nullable: true })
    image: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ name: 'delete_at' })
    deleteAt: Date;

    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[]

    @OneToMany(() => Lesson, (lesson) => lesson.question)
    lessons: Lesson

    @OneToMany(() => ExamQuestion, (examquestion) => examquestion.question)
    examQuestions: ExamQuestion[]

    @ManyToOne(() => Group_Question, (group_question) => group_question.questions)
    group_question: Group_Question

    @OneToMany(() => Result_Detail, (result_detail) => result_detail.question)
    result_details: Result_Detail[]
}
