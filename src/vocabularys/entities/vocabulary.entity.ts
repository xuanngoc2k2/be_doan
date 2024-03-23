import { User_Vocabulary } from 'src/user_vocabulary/entities/user_vocabulary.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vocabulary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    word: string;

    @Column({ nullable: false })
    meaning: string;

    @Column({ nullable: false })
    example: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => User_Vocabulary, (user_vocabulary) => user_vocabulary.vocabulary)
    user_vocabularys: User_Vocabulary[]
}
