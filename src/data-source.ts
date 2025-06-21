// src/data-source.ts
import {  DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { User } from "./auth/entities/user.entity";
import { RefreshToken } from "./auth/entities/refresh-token.entity";
import { Prof } from "./user/entities/Prof.entity";
import { Gestionnaire } from "./user/entities/Gestionnaire.entity";
import { Student } from "./user/entities/Student.entity";
import { Admin } from "./user/entities/Admin.entity";

const isProd = process.env.NODE_ENV === "production";

const options: DataSourceOptions & SeederOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "ecolehub",
  entities: [User,RefreshToken,Admin,Prof,Gestionnaire,Student],
  synchronize: true,

  // 🔄 switch glob by environment
  seeds: isProd
    ? ["dist/database/seeds/**/*.seeder.js"]  
    : ["src/database/seeds/**/*.seeder.ts"],  

    factories: isProd
    ? ["dist/database/factories/**/*.factory.js"]
    : ["src/database/factories/**/*.factory.ts"],
};

export default new DataSource(options);
