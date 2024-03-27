import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'longtext' })
    content: string;

    @Column({ nullable: true })
    image: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deleteAt: Date;
}
