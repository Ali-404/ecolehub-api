import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { Admin } from 'src/user/entities/Admin.entity';
import { Gestionnaire } from 'src/user/entities/Gestionnaire.entity';
import { Prof } from 'src/user/entities/Prof.entity';
import { Student } from 'src/user/entities/Student.entity';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '15m' },
        }),
        ConfigModule,
        TypeOrmModule.forFeature([User,RefreshToken,Admin, Gestionnaire, Prof, Student]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, JwtStrategy],
})
export class AuthModule {}
