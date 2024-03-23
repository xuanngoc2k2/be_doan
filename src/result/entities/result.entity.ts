import { Exam } from 'src/exams/entities/exam.entity';
import { Result_Detail } from 'src/result_detail/entities/result_detail.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Result {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    score: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Exam, (exam) => exam.results)
    exam: Exam

    @OneToMany(() => Result_Detail, (result_detail) => result_detail.result)
    result_details: Result_Detail[]

    @ManyToOne(() => User, (user) => user.results)
    user: User
}
