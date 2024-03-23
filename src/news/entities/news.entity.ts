import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'longtext' })
    content: string;

    @Column({ nullable: false })
    image: string;

    @CreateDateColumn()
    createdAt: Date;
}
