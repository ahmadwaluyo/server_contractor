import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from '../dto/user.login-dto';
import { User } from '../entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from '../dto/user.dto';
import { RoleEntity } from '../../role/entities/role.entity';
import { Project } from 'src/projects/entities/project.entity';
import ResponseStatus from '../../middleware/responses';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RoleEntity)
    public roleRepository: Repository<RoleEntity>,
    @InjectRepository(Project)
    public projectRepository: Repository<Project>,
    private authService: AuthService,
  ) { }

  async create(user: UserDto): Promise<User> {
    try {
      const { email, password, name, projectId, username, phone_number, roleId, saldo, salary } = user;
      const findEmail: User = await this.userRepository.findOne({
        where: {
          email
        }
      })
      if (findEmail) throw new ConflictException(`${email} is already created user. Create another user.`);
      const hashPassword: string = await this.authService.hashPassword(password);
      const saveProject: Project = await this.projectRepository.save({ id: projectId });
      const saveRole: RoleEntity = await this.roleRepository.save({ id: roleId });
      return this.userRepository.save({ email, name, username, password: hashPassword, phone_number, saldo, salary, project: saveProject, role: saveRole });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const foundData = await this.userRepository.find({ relations: ['role', 'project', 'absence', 'payroll'] });
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData.map(({ password, ...rest }) => ({ ...rest }))
      }
      return ResponseStatus(payload.statusCode, payload.message, payload.data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(loginUser: User): Promise<LoginUserDto> {
    try {
      const payloadLogin = await this.findUserByUsername(loginUser.username);
      const isValidUser = await this.authService.comparePassword(loginUser.password, payloadLogin.password);
      if (!isValidUser) throw new NotFoundException('Invalid Username or Password');
      const accessToken = await this.authService.generateJWT(payloadLogin);

      return { accessToken, roleId: payloadLogin.role.id };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserById(id: number): Promise<any> {
    try {
      const selectedUser: User = await this.userRepository.findOne({
        where: {
          id
        },
        relations: ['role', 'project', 'absence', 'payroll']
      });
      if (!selectedUser) throw new NotFoundException(`there is no user with ID ${id}`);
      delete selectedUser.password;
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: selectedUser
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    try {
      const selectedUser: User = await this.userRepository.findOne({
        where: {
          username
        },
        relations: ['role', 'project', 'absence', 'payroll'],
      });

      if (!selectedUser) throw new NotFoundException(`there is no user with username->(${username})`);
      return selectedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      await this.userRepository.update(id, updateUserDto);
      const findUser: User = await this.userRepository.findOne({ where: { id }, relations: ['role', 'project', 'absence', 'payroll'] });
      const payload = {
        statusCode: 200,
        message: 'User successfully updated',
        data: findUser
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      await this.userRepository.delete(id);
      const payload = {
        statusCode: 200,
        message: 'User successfully deleted',
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }
}
