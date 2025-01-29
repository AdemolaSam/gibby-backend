import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { makeOptional } from "../helpers";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  ownerId!: string;

  @IsNotEmpty()
  @IsString()
  category!: string;

  @IsNotEmpty()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isStillOpen?: boolean;

  @IsOptional()
  @IsDateString()
  closeDate?: string;

  @IsOptional()
  @IsEnum(["initialised", "completed"])
  workStatus?: "initialised" | "completed";
}

export class QueryTaskDto extends makeOptional(CreateTaskDto) {}

export class UpdateTaskDto extends makeOptional(CreateTaskDto) {}
