import { BadRequestException, Controller, Get, Param, Post, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import Roles from 'src/enums/roles.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {


    constructor(private readonly userService: UserService, @InjectRepository(User) private readonly userRepository:Repository<User>) {}

    // add role to user
    @UseGuards(AuthGuard('jwt'))
    @Post('add_role/:id/:role')
    async addRole(@Param('id', ParseIntPipe) id: number, @Param('role') role: Roles) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new BadRequestException('Utilisateur non trouvé !');
        switch (role) {
            case Roles.ADMIN:
                return this.userService.addAdminRole(user);
            case Roles.PROF:
                return this.userService.addProfRole(user);
            case Roles.STUDENT:
                return this.userService.addStudentRole(user);
            case Roles.GESTIONNAIRE:
                return this.userService.addGestionnaireRole(user);
            default:
                throw new BadRequestException('Rôle non valide !');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('with_role/:id')
    async getUserWithRole(@Param('id', ParseIntPipe) id: number) {
        const user = await this.userService.getUserWithRole(id);
        if (!user) throw new BadRequestException('Utilisateur non trouvé !');
        return user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('user')
    async getMe(@Request() req) {
        const userId = req.user?.userId;
        if (!userId) throw new BadRequestException('Utilisateur non authentifié !');
        const user = await this.userService.getUserWithRole(userId);
        if (!user) throw new BadRequestException('Utilisateur non trouvé !');
        return user;
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('delete/:id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }

}
