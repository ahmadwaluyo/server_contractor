import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ResponseStatus from 'src/middleware/responses';
import { Project } from 'src/projects/entities/project.entity';
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
  ){}

  async create(createTransactionDto: CreateTransactionDto): Promise<Payload> {
    try {
      const { category, descriptions, projectId, transaction_date, credit } = createTransactionDto;
      const saveProject: Project = await this.projectRepository.save({ id: projectId });
      const data = await this.transactionRepository.save({ category, descriptions, project: saveProject, transaction_date, credit });
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: data
      }
      return payload;
    } catch(error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Transaction []> {
    try {
      const foundData = await this.transactionRepository.find({ relations: ['project'], order: { id: 'desc' } })
      if (!foundData) throw new NotFoundException('Transaction not found !');
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

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
