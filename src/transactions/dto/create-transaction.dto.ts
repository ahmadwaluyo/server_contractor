import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { Transaction } from "../entities/transaction.entity";

export class CreateTransactionDto {

  @IsNumber()
  credit: number;

  @IsString()
  descriptions?: string;

  @IsEnum(Transaction)
  category: 'material' | 'konsumsi' | 'transportasi' | 'project_fee' | 'lainnya';

  @IsDate()
  transaction_date: Date;

  @IsNumber()
  projectId: number;
  
}
