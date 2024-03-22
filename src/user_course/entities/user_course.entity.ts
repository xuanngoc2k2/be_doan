import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User_Course {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    courseId: number;

    @Column({ nullable: false, type: 'float' })
    progress: number;

    @Column({ nullable: false })
    startAt: Date

    @Column()
    completeAt: Date

    @ManyToOne(() => User, (user) => user.user_courses)
    user: User

    @ManyToOne(() => Course, (course) => course.user_courses)
    course: Course
}
