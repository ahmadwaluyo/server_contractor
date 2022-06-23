import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ResponseStatus from 'src/middleware/responses';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

export interface Payload {
  statusCode: number;
  message: string;
  data: Transaction | Transaction[]
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
  ) { }

  async create(createTransactionDto: CreateTransactionDto): Promise<Payload> {
    try {
      const { category, descriptions, projectId, userId, transaction_date, credit, debit } = createTransactionDto;
      const saveProject: Project = await this.projectRepository.save({ id: projectId });
      const saveUser: User = await this.userRepository.save({ id: userId });
      const data = await this.transactionRepository.save({ category, descriptions, project: saveProject, applicant: saveUser, transaction_date, credit, debit });
      const payload = {
        statusCode: 201,
        message: 'OK',
        data: data
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Transaction[]> {
    try {
      const foundData = await this.transactionRepository.find({ relations: ['project', 'applicant'], order: { id: 'desc' } })
      if (!foundData) throw new NotFoundException('Transaction not found !');
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData
      }
      foundData.forEach((el) => {
        delete el.applicant.password;
      });
      return ResponseStatus(payload.statusCode, payload.message, payload.data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findBy(id: number): Promise<Transaction> {
    try {
      const foundData = await this.transactionRepository.find({
        relations: ['project', 'applicant'], where: {
          project: {
            id
          }
        },
        order: { id: 'desc' }
      });
      if (!foundData) throw new NotFoundException('Transaction not found !');
      foundData.forEach((el) => {
        delete el.applicant.password;
      });
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData
      }
      return ResponseStatus(payload.statusCode, payload.message, payload.data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findCashbond(id: number): Promise<Transaction> {
    try {
      const foundData = await this.transactionRepository.find({
        relations: ['project', 'applicant'], where: {
          applicant: {
            id
          }
        },
        order: { id: 'desc' }
      });
      if (!foundData) throw new NotFoundException('Transaction not found !');
      foundData.forEach((el) => {
        delete el.applicant.password;
      });
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData
      }
      return ResponseStatus(payload.statusCode, payload.message, payload.data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<any> {
    try {
      const foundTransaction = await this.transactionRepository.findOne({
        where: {
          id,
        }, relations: ['project', 'applicant']
      });
      if (!foundTransaction) throw new NotFoundException('Transaction not found !');
      if (updateTransactionDto.isApproved) {
        await this.projectRepository.update(foundTransaction.project.id, { saldo_project: foundTransaction.project.saldo_project - foundTransaction.credit });
        await this.userRepository.update(foundTransaction.applicant.id, { saldo: foundTransaction.applicant.saldo - foundTransaction.credit });
        const saveUser: User = await this.userRepository.save({ id: foundTransaction.applicant.id });
        const saveProject: Project[] = await this.projectRepository.save([{ id: foundTransaction.project.id }]);
        await this.payrollRepository.save({ salary: foundTransaction.credit, userId: foundTransaction.applicant.id, employee: saveUser, descriptions: "cashbond", projects: saveProject });
      }
      await this.transactionRepository.update(id, updateTransactionDto);
      const payload = {
        statusCode: 200,
        message: 'Transaction successfully updated',
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      await this.transactionRepository.delete(id);
      const payload = {
        statusCode: 200,
        message: 'Success Delete Transaction',
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }
}
