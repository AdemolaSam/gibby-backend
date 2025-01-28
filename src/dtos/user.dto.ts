import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { makeOptional } from "../helpers";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname!: string;

  @IsNotEmpty()
  @IsString()
  lastname!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;

  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  @IsString()
  walletAddress?: string;

  @IsOptional()
  @IsEnum({ regular: "regular", admin: "admin" })
  role?: "regular" | "admin";
}

export class UpdateUserDto extends makeOptional(CreateUserDto) {}
