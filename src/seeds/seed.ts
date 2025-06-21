import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { AuthService } from "../auth/auth.service";
import Roles from "../enums/roles.enum";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authService = app.get(AuthService)


  console.log('Seeding database...');

  await authService.register({
    email: "admin@gmail.com",
    password: "Admin@123",
    birth_date: "1990-01-01",
    first_name: "Admin",
    last_name: "User",
    phone_number: "0614929124",
    role: Roles.ADMIN,
    CIN: "AI1204",
    address: "123 Admin Street",
    password_confirmation: "Admin@123"

  })
  console.log('✅ Seeding done!');
  await app.close()
}

bootstrap()
  .catch((error) => {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
)