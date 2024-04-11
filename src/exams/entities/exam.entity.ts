import { ExamGrquestion } from 'src/exam-grquestion/entities/exam-grquestion.entity';
import { Result } from 'src/result/entities/result.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    exam_name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: false })
    duration: number;

    @Column()
    startAt: Date;

    @Column()
    endAt: Date;

    @Column({ default: 'TOPIK I' })
    type: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deleteAt: Date;

    @OneToMany(() => Result, (result) => result.exam)
    results: Result[];

    @OneToMany(() => ExamGrquestion, (examGrquestion) => examGrquestion.exam)
    examGrquestions: ExamGrquestion[];
}
