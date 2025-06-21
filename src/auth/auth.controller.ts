import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** Public: log in */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginDto) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe est incorrect!');
    }
    return this.authService.login(user);
  }

  /** Public: register */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDTO) {
    if (dto.password !== dto.password_confirmation) {
      throw new BadRequestException('Vous devez confirmer votre mot de passe !');
    }
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return this.authService.getUsers();
  }

  /** Refresh tokens (strategy name: "jwt-refresh") */
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: any) {
    // passport will populate req.user (payload) and req.authInfo (raw token)
    return this.authService.refreshTokens(req.user.sub, req.authInfo);
  }

  /** Logout (also protected by the refresh-token strategy) */
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.sub, req.authInfo);
    return { message: 'Déconnexion réussie' };
  }
}