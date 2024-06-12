import { Lesson } from 'src/lesson/entities/lesson.entity';
import { User_Course } from 'src/user_course/entities/user_course.entity';
import { Vocabulary } from 'src/vocabularys/entities/vocabulary.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    course_name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    image: string;

    @Column({ nullable: false })
    level_required: number;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @OneToMany(() => Lesson, (lesson) => lesson.course)
    lessons: Lesson[]

    @OneToMany(() => User_Course, (user_course) => user_course.course)
    user_courses: User_Course[]

    // @OneToMany(() => Vocabulary, (vocabulary) => vocabulary.course)
    // vocabularys: Vocabulary[]

}
