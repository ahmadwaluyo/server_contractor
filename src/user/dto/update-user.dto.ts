import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(UserDto) {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone_number: string;

  @IsNumber()
  saldo: number;

  @IsNumber()
  salary: number;

  @IsBoolean()
  status: boolean;

}
