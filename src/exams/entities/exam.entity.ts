import { Question } from 'src/question/entities/question.entity';
import { Result } from 'src/result/entities/result.entity';
import { Type_Question } from 'src/type_question/entities/type_question.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    exam_name: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    duration: number;

    @Column()
    startAt: Date;

    @Column()
    endAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Result, (result) => result.exam)
    results: Result[]

    @OneToMany(() => Question, (question) => question.exam)
    questions: Question[]

    @OneToMany(() => Type_Question, (type_question) => type_question.exam)
    type_questions: Type_Question[]
}
