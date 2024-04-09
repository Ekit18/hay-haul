import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 16)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;

  @IsArray()
  @IsString({ each: true })
  @ValidateIf((o) => o.role === UserRole.Farmer)
  readonly facilityProductTypes?: string[];

  @IsString()
  @IsNotEmpty()
  readonly facilityName: string;

  @IsString()
  @IsNotEmpty()
  readonly facilityAddress: string;

  @IsString()
  @IsNotEmpty()
  readonly facilityOfficialCode: string;
}
