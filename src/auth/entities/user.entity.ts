import Roles from "src/enums/Roles.enum";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    email: string

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({type: "date"})
    birth_date: Date;

    @Column({unique: true})
    CIN: string

    @Column({nullable:true})
    phone_number: string

    @Column()
    password: string;

    @Column({type: "enum",enum: Roles, default: Roles.STUDENT})
    role: Roles;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    


    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!this.password) return;
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
}