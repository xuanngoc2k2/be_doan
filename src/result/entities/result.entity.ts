import { Exam } from 'src/exams/entities/exam.entity';
import { Result_Detail } from 'src/result_detail/entities/result_detail.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Result {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    score: number;

    @Column({ nullable: false })
    userId: number;

    @Column({ nullable: false })
    examId: number;

    @Column({ nullable: false, default: 0 })
    count: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Exam, (exam) => exam.results)
    exam: Exam

    @OneToMany(() => Result_Detail, (result_detail) => result_detail.result)
    result_details: Result_Detail[]

    @ManyToOne(() => User, (user) => user.results)
    user: User
}
