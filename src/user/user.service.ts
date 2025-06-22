import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import Roles from 'src/enums/roles.enum';
import {  Repository } from 'typeorm';
import { Admin } from './entities/Admin.entity';
import { Prof } from './entities/Prof.entity';
import { Gestionnaire } from './entities/Gestionnaire.entity';
import { Student } from './entities/Student.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
        @InjectRepository(Admin)
        private readonly adminRepository:Repository<Admin>,
        @InjectRepository(Prof)
        private readonly profRepository:Repository<Prof>,
        @InjectRepository(Gestionnaire)
        private readonly gestionnaireRepository:Repository<Gestionnaire>,
        @InjectRepository(Student)
        private readonly studentRepository:Repository<Student>,
    ) {}


    public async addAdminRole(user: User) {
        return this.addRole(user, Roles.ADMIN, this.adminRepository, 'admin', 'administrateur');
    }

    public async addProfRole(user: User) {
        return this.addRole(user, Roles.PROF, this.profRepository, 'prof', 'professeur');
    }

    public async addStudentRole(user: User) {
        return this.addRole(user, Roles.STUDENT, this.studentRepository, 'student', 'étudiant');
    }

    public async addGestionnaireRole(user: User) {
        return this.addRole(user, Roles.GESTIONNAIRE, this.gestionnaireRepository, 'gestionnaire', 'gestionnaire');
    }

    private async addRole(user: User, role: Roles, repository: Repository<any>, property: string, label: string) {
        user.role = role;
        // check if already exists
        const oldRole = await repository.findOneBy({ user: { id: user.id } });
        if (oldRole) {
            user[property] = oldRole;
        } else {
            const newRole = repository.create({ user: user });
            await repository.save(newRole);
            user[property] = newRole;
        }
        await this.userRepository.save(user);
        return { message: `Utilisateur est un ${label}.` };
    }

    public async getUserWithRole(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['admin', 'prof', 'student', 'gestionnaire']
        });
        return user;
    }

}
