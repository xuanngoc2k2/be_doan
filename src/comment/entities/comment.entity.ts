import { Lesson } from 'src/lesson/entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    comment: string;

    @Column({ nullable: false })
    commentAt: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.comments)
    user: User

    @ManyToOne(() => Lesson, (lesson) => lesson.comments)
    lesson: Lesson
}
