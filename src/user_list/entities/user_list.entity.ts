import { ListVocab } from "src/list-vocab/entities/list-vocab.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class UserList {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    listVocabId: number;

    @ManyToOne(() => User, (user) => user.userlist)
    user: User

    @ManyToOne(() => ListVocab, (listvob) => listvob.userlist)
    listVocab: ListVocab

    // @OneToMany(() => Vocabulary, (vocabulary) => vocabulary.course)
    // vocabularys: Vocabulary[]

}
