import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "ecolehub",
      entities: [User],
      autoLoadEntities: true,
      synchronize: true,
      

    }),
    AuthModule,
  ],
})
export class AppModule {}
