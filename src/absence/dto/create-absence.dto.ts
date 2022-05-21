import { IsDate, IsNumber } from "class-validator";

export class CreateAbsenceDto {

  @IsDate()
  clock_in: Date;

  @IsNumber()
  userId: number;

}
