import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNumber } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsNumber()
  debit: number;

  @IsNumber()
  cashbond: number;

  @IsDate()
  transaction_update: Date;
}
