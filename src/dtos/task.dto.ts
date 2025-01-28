import { IsNotEmpty, IsOptional, IsSemVer, IsString } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
