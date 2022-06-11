import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber } from 'class-validator';
import { CreateAbsenceDto } from './create-absence.dto';

export class UpdateAbsenceDto extends PartialType(CreateAbsenceDto) {
  @IsBoolean()
  isApproved?: boolean;

  @IsNumber()
  overtime?: number;

  @IsBoolean()
  request_overtime?: boolean;
}
