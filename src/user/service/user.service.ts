import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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
  }

  async findAll(): Promise<User[]> {
    const foundData = await this.userRepository.find({ relations: ['role', 'project', 'absence'] });
    const payload = {
      statusCode: 200,
      message: 'OK',
      data: foundData.map(({ password, ...rest }) => ({ ...rest }))
    }
    return ResponseStatus(payload.statusCode, payload.message, payload.data);
  }

  async login(loginUser: User): Promise<LoginUserDto> {
    const payloadLogin = await this.findUserByUsername(loginUser.username);
    const accessToken: string = await this.authService.generateJWT(payloadLogin);
    return { accessToken };
  }

  async findUserById(id: number): Promise<User> {
    const selectedUser: User = await this.userRepository.findOne({
      where: {
        id
      },
      relations: ['role', 'project']
    });
    if (!selectedUser) throw new NotFoundException(`there is no user with ID ${id}`);
    return selectedUser;
  }

  async findUserByUsername(username: string): Promise<User> {
    const selectedUser: User = await this.userRepository.findOne({
      where: {
        username
      },
      relations: ['role', 'project'],
    });
    if (!selectedUser) throw new NotFoundException(`there is no user with username->(${username})`);
    return selectedUser;
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const id = userId;
    return this.userRepository.update(id, updateUserDto);
  }
}
