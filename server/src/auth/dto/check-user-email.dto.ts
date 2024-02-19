import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckUserEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
