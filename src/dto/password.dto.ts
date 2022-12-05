import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirm_new_password: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
