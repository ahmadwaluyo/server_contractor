import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsNumber } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsNumber()
  debit: number;

  @IsDate()
  transaction_update: Date;

  @IsBoolean()
  isApproved: boolean;

  @IsBoolean()
  isPayed: boolean;
}
