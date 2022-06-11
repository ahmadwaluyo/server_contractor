import { IsBoolean, IsDate, IsNumber } from "class-validator";

export class CreateAbsenceDto {

  @IsDate()
  clock_in: Date;

  @IsNumber()
  userId: number;

  @IsNumber()
  projectId: number;

  @IsNumber()
  overtime: number;

  @IsBoolean()
  isApproved: boolean;

}
