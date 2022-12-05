import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SigninDto {
  @IsString()
  @ApiProperty()
  email: string;
  @IsString()
  @ApiProperty()
  password: string;
}
