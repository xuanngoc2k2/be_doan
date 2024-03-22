import { Lesson } from 'src/lesson/entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User_Lesson {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    lessonId: number;

    @Column({ nullable: false })
    isComplete: number;

    @Column()
    completeAt: Date;

    @Column()
    currentTime: string;

    @ManyToOne(() => User, (user) => user.user_lessons)
    user: User

    @ManyToOne(() => Lesson, (lesson) => lesson.user_lessons)
    lesson: Lesson

}
