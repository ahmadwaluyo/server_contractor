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
    let tempProjects = [];
    try {
      const { email, password, name, projectId, username, phone_number, roleId, saldo, salary } = user;
      const findEmail: User = await this.userRepository.findOne({
        where: {
          email
        }
      })
      if (findEmail) throw new ConflictException(`${email} is already created user. Create another user.`);
      const hashPassword: string = await this.authService.hashPassword(password);
      projectId.forEach(async (el: any) => {
        const saveProject: Project = await this.projectRepository.save({ id: el });
        tempProjects.push(saveProject);
      });
      // const saveProject: Project[] = await this.projectRepository.save([{ id: projectId }]);
      const saveRole: RoleEntity = await this.roleRepository.save({ id: roleId });
      const dataUser = await this.userRepository.save({ email, name, username, password: hashPassword, phone_number, saldo, salary, projects: tempProjects, role: saveRole });
      delete dataUser.password;
      const payload = {
        statusCode: 201,
        message: 'OK',
        data: dataUser,
      }
      return ResponseStatus(payload.statusCode, payload.message, payload.data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const foundData = await this.userRepository.find({ relations: ['role', 'projects', 'absence', 'payroll', 'transactions'] });
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
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: { accessToken, roleId: payloadLogin.role.id }
      }
      return ResponseStatus(payload.statusCode, payload.message, payload.data);
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
        relations: ['role', 'projects', 'absence', 'payroll', 'transactions']
      });
      if (!selectedUser) throw new NotFoundException(`there is no user with ID ${id}`);
      delete selectedUser.password;
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: selectedUser
      }
      return ResponseStatus(payload.statusCode, payload.message, payload.data);
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
        relations: ['role', 'projects', 'absence', 'payroll', 'transactions'],
      });

      if (!selectedUser) throw new NotFoundException(`there is no user with username->(${username})`);
      return selectedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUsernameForPublic(username: string): Promise<User> {
    try {
      const selectedUser: User = await this.userRepository.findOne({
        where: {
          username
        },
        relations: ['role', 'projects', 'absence', 'payroll', 'transactions'],
      });

      if (!selectedUser) throw new NotFoundException(`there is no user with username->(${username})`);
      delete selectedUser.password;
      const accessToken = await this.authService.generateJWT(selectedUser);
      return ResponseStatus(200, 'OK', accessToken);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserByRoleId(id: number): Promise<User> {
    try {
      const selectedUser: User = await this.userRepository.findOne({
        where: {
          role: {
            id,
          }
        },
        relations: ['role', 'projects', 'absence', 'payroll', 'transactions'],
      });
      if (!selectedUser) throw new NotFoundException(`there is no user with role ID->(${id})`);
      delete selectedUser.password;
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: selectedUser
      };
      return ResponseStatus(payload.statusCode, payload.message, payload.data);
    } catch (error: Error | any) {
      throw new Error(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      let newPassword: string;
      let finalPayload = updateUserDto;

      if (updateUserDto.password) {
        newPassword = await this.authService.hashPassword(updateUserDto.password);
        finalPayload = {
          ...updateUserDto,
          password: newPassword,
        };
      }

      await this.userRepository.update(id, finalPayload);
      const findUser: User = await this.userRepository.findOne({ where: { id }, relations: ['role', 'projects', 'absence', 'payroll'] });
      delete findUser.password;
      const payload = {
        statusCode: 200,
        message: 'User successfully updated',
        data: findUser
      }
      return ResponseStatus(payload.statusCode, payload.message, payload.data);
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
