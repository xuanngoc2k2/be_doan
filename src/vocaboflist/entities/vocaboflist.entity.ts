import { ListVocab } from "src/list-vocab/entities/list-vocab.entity";
import { User_Vocabulary } from "src/user_vocabulary/entities/user_vocabulary.entity";
import { Vocabulary } from "src/vocabularys/entities/vocabulary.entity";
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Vocaboflist {
    @PrimaryColumn()
    listVocabId: number;

    @PrimaryColumn()
    vocabularyId: number;

    @ManyToOne(() => Vocabulary, (vocab) => vocab.vocablist)
    vocabulary: Vocabulary

    @ManyToOne(() => ListVocab, (listvob) => listvob.vocablist)
    listVocab: ListVocab

    //thêm
    @OneToMany(() => User_Vocabulary, (user_vocabulary) => user_vocabulary.vocabOfList)
    userVocab: User_Vocabulary[]
}
