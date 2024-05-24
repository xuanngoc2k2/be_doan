import { UserList } from "src/user_list/entities/user_list.entity";
import { User_Vocabulary } from "src/user_vocabulary/entities/user_vocabulary.entity";
import { User } from "src/users/entities/user.entity";
import { Vocaboflist } from "src/vocaboflist/entities/vocaboflist.entity";
import { Vocabulary } from "src/vocabularys/entities/vocabulary.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ListVocab {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ nullable: true })
    description: string

    @CreateDateColumn()
    createAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => UserList, (userlist) => userlist.listVocab)
    userlist: UserList[]

    // @OneToMany(() => User_Vocabulary, (user_vocabulary) => user_vocabulary.listVob)
    // userVocab: User_Vocabulary[];

    @OneToMany(() => Vocaboflist, (vocaboflist) => vocaboflist.listVocab)
    vocablist: Vocaboflist[]

    // @ManyToMany(() => Vocabulary, (vocab) => vocab.listvocabs)
    // vocabularys: Vocabulary[]
}
