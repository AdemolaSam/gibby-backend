import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";
import { makeOptional } from "../helpers";

export class MemberDto {
  @IsNotEmpty()
  @IsString()
  @Length(24)
  id!: string;
}

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @MinLength(5)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(24)
  owner!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(5)
  description!: string;

  @IsOptional()
  members?: MemberDto;
}

export class UpdateOrganizationDto extends makeOptional(CreateOrganizationDto) {
  @IsNotEmpty()
  @IsString()
  @Length(24)
  id!: string;
}
