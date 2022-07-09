import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import decimalAdjust from 'src/middleware/adjustmentSalary';
import ResponseStatus from 'src/middleware/responses';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entity/user.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { Absence } from './entities/absence.entity';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(Absence)
    private absenceRepository: Repository<Absence>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createAbsenceDto: CreateAbsenceDto): Promise<Absence> {
    try {
      const { clock_in, userId, projectId, isApproved, lat, long } = createAbsenceDto;
      const saveUser: User = await this.userRepository.save({ id: userId });
      const saveProject: Project = await this.projectRepository.save({ id: projectId });
      const dataAbsence = await this.absenceRepository.save({ clock_in, userId, karyawan: saveUser, project: saveProject, isApproved, lat, long });
      return ResponseStatus(201, 'Absence Created Successfully', dataAbsence);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Absence[]> {
    try {
      const foundData = await this.absenceRepository.find({ relations: ['karyawan', 'project'], order: { id: 'DESC' } });
      foundData.forEach((el) => {
        delete el.karyawan.password;
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

  async findOne(id: number): Promise<any> {
    try {
      const foundData = await this.absenceRepository.findOne({
        where: { id },
        relations: ['karyawan', 'project'],
      });
      if (!foundData) throw new NotFoundException(`There is no data absence with id ${id}`);
      delete foundData.karyawan.password;
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

  async findAbsenceByUserId(id: number): Promise<any> {
    try {
      const foundData = await this.absenceRepository.find({
        where: {
          karyawan: {
            id
          }
        },
        relations: ['karyawan', 'project'], order: { id: 'DESC' }
      });
      if (!foundData) throw new NotFoundException(`Data Absence with user id ${id} not found`);
      foundData.forEach((el) => {
        delete el.karyawan.password;
      });
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData,
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAbsenceByProjectId(id: number): Promise<any> {
    try {
      const foundData = await this.absenceRepository.find({
        where: {
          project: {
            id
          }
        },
        relations: ['karyawan', 'project'], order: { id: 'DESC' }
      });
      if (!foundData) throw new NotFoundException(`Data Absence with user id ${id} not found`);
      foundData.forEach((el) => {
        delete el.karyawan.password;
      });
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData,
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAbsenceByClockIn(user_id: number, clock_in: Date): Promise<any> {
    try {
      const foundData = await this.absenceRepository.findOne({
        where: {
          karyawan: {
            id: user_id
          },
          clock_in: MoreThanOrEqual(clock_in),
        },
        relations: ['karyawan', 'project']
      });
      if (!foundData) throw new NotFoundException('Data Absence not found !');
      delete foundData.karyawan.password;
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData,
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateAbsenceDto: UpdateAbsenceDto) {
    try {
      const foundData = await this.absenceRepository.findOne({ where: { id }, relations: ['karyawan'] });

      let overtime: number = 0;
      let finalSaldo: number = 0;

      if (!foundData) throw new NotFoundException('Failed to Update Absence !');

      if (updateAbsenceDto.isApproved) {
        const foundUser = await this.userRepository.findOne({ where: { id: foundData.karyawan.id } });

        if (updateAbsenceDto.overtime > 0) {
          overtime = (foundUser.salary / 7) * foundData.overtime;
        }
        finalSaldo = foundUser.saldo + foundUser.salary + (foundData.karyawan.salary / 7) * foundData.overtime;

        await this.userRepository.update(foundData.karyawan.id, { saldo: decimalAdjust('round', finalSaldo, 3) });
      }
      const updatedAbsence = await this.absenceRepository.update(id, updateAbsenceDto);
      return ResponseStatus(200, 'OK', updatedAbsence);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const deletedAbsence = await this.absenceRepository.delete(id);
      return ResponseStatus(200, 'OK', deletedAbsence);
    } catch (error) {
      throw new Error(error);
    }
  }
}
