import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Must be string' })
  @IsEmail({}, { message: 'Wrong e-mail' })
  @IsOptional()
  readonly email: string;

  @IsString({ message: 'Must be string' })
  @Length(4, 16, { message: 'From 4 to 16 symbols' })
  @IsOptional()
  readonly password: string;

  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly userName: string;
}
