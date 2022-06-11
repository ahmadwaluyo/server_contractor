import { IsNumber, IsString } from "class-validator";

export class CreatePayrollDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  projectId: number;

  @IsNumber()
  salary: number;

  @IsString()
  descriptions: string;
}
