import { Lesson } from 'src/lesson/entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    comment: string;

    @Column({ nullable: true, default: null })
    commentAt: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ name: 'delete_at' })
    deleteAt: Date;

    @Column({ nullable: false })
    lessonId: number;

    @ManyToOne(() => User, (user) => user.comments)
    user: User

    @ManyToOne(() => Lesson, (lesson) => lesson.comments)
    lesson: Lesson
}
