/* eslint-disable @typescript-eslint/no-unused-vars */
// auth.service.ts
import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDTO } from './dto/register.dto';
import JwtPayload from './types/jwt.type';
import { randomBytes } from 'crypto';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshRepo: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getUsers(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'email', 'first_name', 'last_name', 'createdAt', 'updatedAt', 'role', "CIN", "phone_number"],
    });
  }

 

  async register(user: RegisterDTO){
    const user_old = await this.userRepo.findOne({where: {email: user.email}})
    if (user_old) throw new ConflictException("Il y'a deja un etudiant avec cet email !")
    const newUser =  this.userRepo.create(user)
    await this.userRepo.save(newUser)
    return newUser
  }

  async user(id: number): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
    });
  }


   async login(user: { email: string; id: number }) {
    const payload: JwtPayload = { email: user.email, sub: user.id };

    // 1) create short-lived access token
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m',secret: process.env.JWT_SECRET });

    // 2) create long-lived refresh token
    const refreshToken = randomBytes(64).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    // persist the refresh token
    await this.refreshRepo.save(
      this.refreshRepo.create({ token: refreshToken, user: { id: user.id } as User, expiresAt }),
    );

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: number, token: string) {
    const record = await this.refreshRepo.findOne({ where: { token }, relations: ['user'] });
    if (!record || record.user.id !== userId || record.expiresAt < Date.now()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // issue new tokens
    const payload: JwtPayload = { email: record.user.email, sub: userId };
    const newAccess = this.jwtService.sign(payload, { expiresIn: '15m' });
    const newRefresh = randomBytes(64).toString('hex');
    const newExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;

    // delete old and save new
    await this.refreshRepo.delete(record.id);
    await this.refreshRepo.save(
      this.refreshRepo.create({ token: newRefresh, user: record.user, expiresAt: newExpires }),
    );

    return { accessToken: newAccess, refreshToken: newRefresh };
  }

  async logout(userId: number, token: string) {
    // remove only that token (or you could delete all for the user)
    await this.refreshRepo.delete({ user: { id: userId } as User, token });
    return { message: 'Logged out' };
  }


}
