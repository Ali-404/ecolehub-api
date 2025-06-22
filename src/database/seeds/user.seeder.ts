import Roles from "src/enums/roles.enum";
import { User } from "../../auth/entities/user.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Admin } from "src/user/entities/Admin.entity";
import { Prof } from "src/user/entities/Prof.entity";
import { Gestionnaire } from "src/user/entities/Gestionnaire.entity";
import { Student } from "src/user/entities/Student.entity";

export default class UserSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const userFactory = factoryManager.get(User);
        const adminRepository = dataSource.getRepository(Admin);
        const profRepository = dataSource.getRepository(Prof);
        const gestionnaireRepository = dataSource.getRepository(Gestionnaire);
        const studentRepository = dataSource.getRepository(Student);
        const userRepository = dataSource.getRepository(User);

        // Check if admin user already exists
        let adminUser = await userRepository.findOne({ where: { email: "admin@gmail.com" } });
        if (!adminUser) {
            adminUser = await userFactory.save({
                first_name: "Admin",
                last_name: "User",
                email: "admin@gmail.com",
                password: "Admin@123",
                role: Roles.ADMIN,
                birth_date: new Date("2000-01-01"),
                CIN: "AB123456",
            });
            await adminRepository.save(adminRepository.create({ user: adminUser }));
        }

        // Create 20 random users
        const users = await userFactory.saveMany(20);
        for (const user of users) {
            switch (user.role) {
                case Roles.ADMIN:
                    await adminRepository.save(adminRepository.create({ user }));
                    break;
                case Roles.PROF:
                    await profRepository.save(profRepository.create({ user }));
                    break;
                case Roles.STUDENT:
                    await studentRepository.save(studentRepository.create({ user }));
                    break;
                case Roles.GESTIONNAIRE:
                    await gestionnaireRepository.save(gestionnaireRepository.create({ user }));
                    break;
            }
        }
    }
}