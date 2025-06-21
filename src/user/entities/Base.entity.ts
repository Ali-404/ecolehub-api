import { User } from "src/auth/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Base{
    @PrimaryGeneratedColumn()
    id: number;


    @CreateDateColumn()
    createdAt: Date; 
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => User,(user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}