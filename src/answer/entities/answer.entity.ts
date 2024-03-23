import { Question } from 'src/question/entities/question.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    answer: string;

    @Column({ nullable: false })
    is_true: boolean;

    @Column({})
    explain: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Question, (question) => question.answers)
    question: Question
}
