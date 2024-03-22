import { Lesson } from 'src/lesson/entities/lesson.entity';
import { User_Course } from 'src/user_course/entities/user_course.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    course_name: string;

    @Column()
    description: string;

    @Column({ nullable: false })
    level_required: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => Lesson, (lesson) => lesson.course)
    lessons: Lesson[]

    @OneToMany(() => User_Course, (user_course) => user_course.course)
    user_courses: User_Course[]
}
