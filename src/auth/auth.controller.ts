import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post("login")
    async login(@Body() {email,password}: LoginDto){
        const user = await this.authService.validateUser(email, password)
        if (!user){
            throw new UnauthorizedException("Email ou mot de passe est incorrect!")
        }

        return this.authService.login(user)
    }

    @Post("register")
    async register(@Body() dto: RegisterDTO){
        if (dto.password !== dto.password_confirmation){
            throw new BadRequestException("Vous devez confirmer votre mot de passe !")
        }
        
        return await this.authService.register(dto)

    }

}
