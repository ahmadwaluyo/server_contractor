import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  project_name: string;

  @IsString()
  owner_name: string;

  @IsString()
  contact_owner: string;

  @IsString()
  project_address: string;

  @IsNumber()
  saldo_project: number;

  @IsNumber()
  value_project: number;

  @IsDate()
  end_date: Date;
}
