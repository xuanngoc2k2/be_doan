import { User } from 'src/users/entities/user.entity';
import { Vocabulary } from 'src/vocabularys/entities/vocabulary.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User_Vocabulary {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    vocabularyId: number;

    @Column({ default: 0 })
    isRemember: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.user_vocabularys)
    user: User

    @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.user_vocabularys)
    vocabulary: Vocabulary
}
