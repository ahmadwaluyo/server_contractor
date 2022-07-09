import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsBoolean()
  status: boolean;

  @IsNumber()
  progress: number;

  @IsNumber()
  saldo_project: number;

  @IsNumber()
  value_project: number;
}
