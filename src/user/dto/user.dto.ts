import { IsNumber, IsString } from "class-validator";

export class UserDto {

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

  @IsNumber()
  projectId: number[];

  @IsNumber()
  roleId: number;

}
