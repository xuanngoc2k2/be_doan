import { Comment } from 'src/comment/entities/comment.entity';
import { Result } from 'src/result/entities/result.entity';
import { User_Course } from 'src/user_course/entities/user_course.entity';
import { User_Lesson } from 'src/user_lesson/entities/user_lesson.entity';
import { User_Vocabulary } from 'src/user_vocabulary/entities/user_vocabulary.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ unique: true })
    phone_number: string;

    @Column({ nullable: false })
    full_name: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: false })
    date_of_birth: Date;

    @Column({ default: 0 })
    level: number;

    @Column({ default: "USER" })
    role: string;

    @Column({ nullable: true })
    last_login: Date;

    @Column({ nullable: true, type: 'longtext' })
    refreshToken: string;

    @CreateDateColumn({ nullable: true })
    createdAt: Date;

    @OneToMany(() => User_Course, (user_course) => user_course.user)
    user_courses: User_Course[]

    @OneToMany(() => User_Lesson, (user_lesson) => user_lesson.user)
    user_lessons: User_Course[]

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]

    @OneToMany(() => User_Vocabulary, (user_vocabulary) => user_vocabulary.user)
    user_vocabularys: User_Vocabulary[]

    @OneToMany(() => Result, (result) => result.user)
    results: Result[]
}
