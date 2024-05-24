import { Course } from 'src/course/entities/course.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { ListVocab } from 'src/list-vocab/entities/list-vocab.entity';
import { User_Vocabulary } from 'src/user_vocabulary/entities/user_vocabulary.entity';
import { Vocaboflist } from 'src/vocaboflist/entities/vocaboflist.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vocabulary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    word: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: false })
    meaning: string;

    @Column({ nullable: true })
    example: string;

    @Column({ nullable: false })
    level: number;

    @Column({ nullable: false })
    spell: string;

    @Column({ nullable: false })
    partOfSpeech: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ name: 'delete_at' })
    deleteAt: Date;

    @OneToMany(() => Vocaboflist, (vol) => vol.vocabulary)
    vocablist: Vocaboflist[]


    // ///bỏ
    // @OneToMany(() => User_Vocabulary, (user_vocabulary) => user_vocabulary.vocabulary)
    // user_vocabularys: User_Vocabulary[]

    //
    // @ManyToMany(() => ListVocab, (listvocab) => listvocab.vocabularys)
    // listvocabs: ListVocab[]
}
