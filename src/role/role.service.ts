import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ResponseStatus from 'src/middleware/responses';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    try {
      const { roleName } = createRoleDto;
      const foundRole = await this.roleRepository.findOne({
        where: { roleName }
      })
      if (foundRole) throw new NotFoundException(`Role ${roleName} is already exist !`);
      const dataRole = await this.roleRepository.save({ roleName });
      return ResponseStatus(201, 'Role Created Successfully', dataRole);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<RoleEntity[]> {
    try {
      const foundData = await this.roleRepository.find({ relations: ['users'] });
      foundData.forEach((el) => {
        el.users.forEach((e) => {
          delete e.password;
        });
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
      const selectedRole: RoleEntity = await this.roleRepository.findOne({
        where: {
          id
        },
        relations: ['users'],
      })
      if (!selectedRole) throw new NotFoundException(`there is no user with ID ${id}`);
      selectedRole.users.forEach((el) => {
        delete el.password;
      });
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: selectedRole
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(roleId: number, updateRoleDto: UpdateRoleDto): Promise<any> {
    try {
      const id = roleId;
      await this.roleRepository.update(id, updateRoleDto);
      const findRole: RoleEntity = await this.roleRepository.findOne({ where: { id } });
      const payload = {
        statusCode: 200,
        message: 'Role successfully updated',
        data: findRole
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      await this.findOne(id);
      await this.roleRepository.delete(id);
      const payload = {
        statusCode: 200,
        message: 'Role successfully deleted',
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }
}