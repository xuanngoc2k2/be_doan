import { User_Vocabulary } from "src/user_vocabulary/entities/user_vocabulary.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => User, (user) => user.listVobs)
    user: User

    @OneToMany(() => User_Vocabulary, (uv) => uv.listVob)
    userVob: User_Vocabulary
}
