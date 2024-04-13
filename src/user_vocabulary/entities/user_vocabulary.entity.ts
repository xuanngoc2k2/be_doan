import { ListVocab } from 'src/list-vocab/entities/list-vocab.entity';
import { User } from 'src/users/entities/user.entity';
import { Vocabulary } from 'src/vocabularys/entities/vocabulary.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User_Vocabulary {
    @PrimaryColumn()
    listVobId: number;

    @PrimaryColumn()
    vocabularyId: number;

    @Column({ default: 0 })
    isRemember: number;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ name: 'delete_at' })
    deleteAt: Date;

    @ManyToOne(() => ListVocab, (lb) => lb.userVob)
    listVob: ListVocab[]

    @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.user_vocabularys)
    vocabulary: Vocabulary
}
