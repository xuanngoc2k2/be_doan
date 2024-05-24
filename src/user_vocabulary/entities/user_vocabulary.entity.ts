import { ListVocab } from 'src/list-vocab/entities/list-vocab.entity';
import { User } from 'src/users/entities/user.entity';
import { Vocaboflist } from 'src/vocaboflist/entities/vocaboflist.entity';
import { Vocabulary } from 'src/vocabularys/entities/vocabulary.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User_Vocabulary {
    // @PrimaryColumn()
    // listVobListVocabId: number;

    // @PrimaryColumn()
    // listVobVocabularyId: number;

    @PrimaryColumn()
    listVocabId: number;

    @PrimaryColumn()
    vocabularyId: number;

    @PrimaryColumn()
    userId: number;

    @Column({ default: 0 })
    isRemember: number;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ name: 'delete_at' })
    deleteAt: Date;

    // @ManyToOne(() => UserList, (ul) => ul.userVob)
    // listVob: UserList[]

    //bỏ
    // @ManyToOne(() => ListVocab, (list_vocab) => list_vocab.userVocab)
    // listVob: ListVocab

    // @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.user_vocabularys)
    // vocabulary: Vocabulary

    //thêm
    @ManyToOne(() => Vocaboflist, (list_vocab) => list_vocab.userVocab)
    @JoinColumn([
        { name: "listVocabId", referencedColumnName: "listVocabId" },
        { name: "vocabularyId", referencedColumnName: "vocabularyId" }
    ])
    vocabOfList: Vocaboflist
    //

    @ManyToOne(() => User, (user) => user.userVocab)
    user: User;
}
