import { IsNumber, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  readonly accessToken: string;

  @IsNumber()
  readonly roleId: number;
}