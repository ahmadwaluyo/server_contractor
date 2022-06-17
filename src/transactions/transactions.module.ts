import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entity/user.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Payroll]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
