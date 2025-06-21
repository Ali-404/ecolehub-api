import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {


    constructor(private readonly userService: UserService) { }

    // add admin role to user
    @Post('add-admin-role')
    addAdminRole() {
        // Logic to add admin role to user
        // This could involve updating the user's role in the database
        return { message: 'Admin role added successfully' };
    }
    // add prof role to prof
    // add student role to student

}
