import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { Absence } from './entities/absence.entity';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(Absence)
    private absenceRepository: Repository<Absence>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createAbsenceDto: CreateAbsenceDto): Promise<Absence> {
    const { clock_in, userId } = createAbsenceDto;
    const saveUser: User = await this.userRepository.save({ id: userId });
    return this.absenceRepository.save({ clock_in, userId, karyawan: saveUser });
  }

  async findAll(): Promise<Absence[]> {
    return this.absenceRepository.find({ relations: ['karyawan'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} absence`;
  }

  update(id: number, updateAbsenceDto: UpdateAbsenceDto) {
    return `This action updates a #${id} absence`;
  }

  async remove(id: number): Promise<void> {
    await this.absenceRepository.delete(id);
  }
}
