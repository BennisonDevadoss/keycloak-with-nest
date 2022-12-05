import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export type UserInstance = User & {
  user_id?: string;
  access_token?: string;
};

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  mobile_no: string;
}
