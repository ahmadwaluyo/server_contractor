import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ResponseStatus from 'src/middleware/responses';
import { Repository, UpdateResult } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}
  
  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const { roleName } = createRoleDto;
    const foundRole = await this.roleRepository.findOne({
      where: { roleName }
    })
    if (foundRole) throw new NotFoundException(`Role ${roleName} is already exist !`);
    return this.roleRepository.save({ roleName });
  }

  async findAll(): Promise<RoleEntity[]> {
    const foundData = await this.roleRepository.find({ relations: ['users'] });
    const payload = {
      statusCode: 200,
      message: 'OK',
      data: foundData
    }
    return ResponseStatus(payload.statusCode, payload.message, payload.data);
  }

  async findOne(id: number): Promise<RoleEntity> {
    const selectedRole: RoleEntity = await this.roleRepository.findOne({
      where: {
        id
      },
      relations: ['users'],
    })
    if (!selectedRole) throw new NotFoundException(`there is no user with ID ${id}`);
    return selectedRole;
  }

  async update(roleId: number, updateRoleDto: UpdateRoleDto): Promise<UpdateResult> {
    const id = roleId;
    return this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.roleRepository.delete(id);
  }
}