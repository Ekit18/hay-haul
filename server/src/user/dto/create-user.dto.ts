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

export class CreateUserDto {
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
  @Length(2, 30)
  readonly fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;

  // Farmer

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.role === UserRole.Farmer)
  readonly farmLocation: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.role === UserRole.Farmer)
  readonly farmName: string;

  @IsString()
  @IsArray()
  @IsString({ each: true })
  @ValidateIf((o) => o.role === UserRole.Farmer)
  readonly farmProducts: string[];

  // Carrier && Businessman

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => [UserRole.Carrier, UserRole.Businessman].includes(o.role))
  readonly companyName: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => [UserRole.Carrier, UserRole.Businessman].includes(o.role))
  readonly companyAddress: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => [UserRole.Carrier, UserRole.Businessman].includes(o.role))
  readonly companyOfficialCode: string;
}
