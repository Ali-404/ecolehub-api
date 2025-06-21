import Roles from "src/enums/roles.enum";
import { User } from "../../auth/entities/user.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export default class UserSeeder implements Seeder {
    
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        

        
        const userFactory = factoryManager.get(User);

         await userFactory.save({
            first_name: "Admin",
            last_name: "User",
            email: "admin@gmail.com",
            password: "Admin@123",
            role: Roles.ADMIN,
            birth_date: new Date("2000-01-01"),
            CIN: "AB123456",
        });


        await userFactory.saveMany(20); // Create 10 random users

       
    }
        
}