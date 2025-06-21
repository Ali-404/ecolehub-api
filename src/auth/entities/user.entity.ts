import Roles from "../../enums/roles.enum";
import {  BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RefreshToken } from "./refresh-token.entity";
import { Admin } from "src/user/entities/Admin.entity";
import { Prof } from "src/user/entities/Prof.entity";
import { Gestionnaire } from "src/user/entities/Gestionnaire.entity";
import { Student } from "src/user/entities/Student.entity";


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

    @Column({nullable: true})
    address: string;


    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!this.password) return;
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }

    @OneToMany(() => RefreshToken, rt => rt.user)
    refreshTokens: RefreshToken[];

    // admin relation
    @OneToOne(() => Admin, (admin) => admin.user, { onDelete: 'CASCADE' })
    admin?: Admin;

    // prof relation
    @OneToOne(() => Prof, (prof) => prof.user, { onDelete: 'CASCADE' })
    prof?: Prof
    // gestionnaire relation
    @OneToOne(() => Gestionnaire, (gestionnaire) => gestionnaire.user, { onDelete: 'CASCADE' })
    gestionnaire?: Gestionnaire
    // student relation
    @OneToOne(() => Student, (student) => student.user, { onDelete: 'CASCADE' })
    student?: Student;

}