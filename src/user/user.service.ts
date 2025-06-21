import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {


    public async addAdminRole() {

        // Logic to add admin role to user
        // This could involve updating the user's role in the database
        return { message: 'Admin role added successfully' };

    }

}
