import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { makeOptional } from "../helpers";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(24)
  owner!: string;

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

export class QueryTaskDto extends makeOptional(CreateTaskDto) {
  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  cursor?: string;
}

export class UpdateTaskDto extends makeOptional(CreateTaskDto) {}
