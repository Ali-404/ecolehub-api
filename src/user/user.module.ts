import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Admin } from './entities/Admin.entity';
import { Gestionnaire } from './entities/Gestionnaire.entity';
import { Prof } from './entities/Prof.entity';
import { Student } from './entities/Student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin, Gestionnaire, Prof, Student]),

  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
