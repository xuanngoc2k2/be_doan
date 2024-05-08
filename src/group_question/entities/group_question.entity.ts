// import { ExamGrquestion } from 'src/exam-grquestion/entities/exam-grquestion.entity';
import { Exam } from 'src/exams/entities/exam.entity';
import { Question } from 'src/question/entities/question.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, LessThan, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group_Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    content: string;

    @Column({ default: null })
    audio: string;

    @Column({ default: null })
    image: string;

    @CreateDateColumn()
    createAt: Date

    @DeleteDateColumn({ name: 'delete_at' })
    deleteAt: Date

    @Column({ nullable: false })
    type: string;

    @OneToMany(() => Question, (question) => question.group_question)
    questions: Question[]

    // @ManyToOne(() => Exam, (exam) => exam.group_questions)
    // exam: Exam

    // @OneToMany(() => ExamGrquestion, (exam_groupQuestion) => exam_groupQuestion.groupQuestion)
    // exgroupQueston: ExamGrquestion[]
}
