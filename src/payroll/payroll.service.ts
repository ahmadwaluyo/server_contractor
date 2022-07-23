import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ResponseStatus from 'src/middleware/responses';
import { Project } from 'src/projects/entities/project.entity';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/user/entity/user.entity';
import { InsertValuesMissingError, Repository } from 'typeorm';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Payroll } from './entities/payroll.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // @InjectRepository(Transaction)
    // private transactionRepository: Repository<Transaction>,
  ) { }

  async create(createPayrollDto: CreatePayrollDto): Promise<Payroll> {
    try {
      const { salary, descriptions, userId, projectId } = createPayrollDto;
      const saveUser: User = await this.userRepository.save({ id: userId });
      const saveProject: Project[] = await this.projectRepository.save([{ id: projectId }]);

      const foundUser: User = await this.userRepository.findOne({ where: { id: userId } });
      const payloadUser = {
        saldo: foundUser.saldo - salary
      }

      const updateUser = await this.userRepository.update(userId, payloadUser);
      const isItDone: Payroll = await this.payrollRepository.save({ salary, userId, employee: saveUser, descriptions, projects: saveProject });
      Promise.all([updateUser, isItDone]);
      
      if (!isItDone) throw new InsertValuesMissingError();

      return ResponseStatus(201, 'Payroll Created Successfully', isItDone);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Payroll[]> {
    try {
      const foundData = await this.payrollRepository.find({ relations: ['employee', 'projects'], order: { id: 'DESC' } });
      foundData.forEach((el) => {
        if (el.employee.password) delete el.employee.password;
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

  async findOne(id: number) {
    try {
      const foundData = await this.payrollRepository.findOne({
        where: { id },
        relations: ['employee', 'projects'],
      });
      if (!foundData) throw new NotFoundException(`There is no data payroll with id ${id}`);
      // delete foundData.employee.password;
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findPayrollByUserId(id: number) {
    try {
      const foundData = await this.payrollRepository.find({
        where: {
          employee: {
            id,
          },
        },
        relations: ['employee', 'projects'],
        order: { id: 'DESC' }
      });
      if (!foundData) throw new NotFoundException(`There is no data payroll with userId ${id}`);
      foundData.forEach((el) => {
        if (el.employee) delete el.employee.password;
      });
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findPayrollByProjectId(id: number) {
    try {
      const foundData = await this.payrollRepository.find({
        where: {
          projects: {
            id,
          },
        },
        relations: ['employee', 'projects'],
        order: { id: 'DESC' }
      });
      if (!foundData) throw new NotFoundException(`There is no data payroll with projectId ${id}`);
      foundData.forEach((el) => {
        if (el.employee) delete el.employee.password;
      });
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updatePayrollDto: UpdatePayrollDto): Promise<any> {
    try {
      await this.payrollRepository.update(id, updatePayrollDto);
      const payload = {
        statusCode: 200,
        message: 'Project successfully updated',
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      await this.findOne(id);
      await this.payrollRepository.delete(id);
      const payload = {
        statusCode: 200,
        message: 'Payroll successfully deleted',
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }
}
