import { User } from "src/auth/entities/user.entity";
import { setSeederFactory } from "typeorm-extension";
import { faker } from "@faker-js/faker";
import Roles from "src/enums/roles.enum";

export default setSeederFactory(User, () => {
    const user = new User();
    user.first_name = faker.person.firstName();
    user.last_name = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.CIN = faker.string.numeric(8);
    user.phone_number = faker.phone.number();
    user.birth_date = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    user.role = faker.helpers.arrayElement(Object.values(Roles)); // Assuming roles are strings
    
    return user;
})