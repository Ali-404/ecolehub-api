import { IsDate, IsDateString, IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";
import Roles from "src/enums/Roles.enum";


export class RegisterDTO{
    @IsEmail()
    email: string;

    @IsStrongPassword({ minLength: 6, minSymbols: 1, minNumbers:1, minUppercase:1,minLowercase:1})
    password:string

    @IsString()
    password_confirmation;

    @IsDateString()
    birth_date: string

    @IsEnum(Roles)
    role: Roles

    @MinLength(3)
    @IsString()
    CIN: string

    @IsOptional()
    @IsMobilePhone()
    phone_number: string

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

}