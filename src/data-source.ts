// src/data-source.ts
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { User } from "./auth/entities/user.entity";
import { RefreshToken } from "./auth/entities/refresh-token.entity";

const isProd = process.env.NODE_ENV === "production";

const options: DataSourceOptions & SeederOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "ecolehub",
  entities: [User,RefreshToken],
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
