import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from '../dto/user.login-dto';
import { User } from '../entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from '../dto/user.dto';
import { RoleEntity } from '../../role/entities/role.entity';
import { Project } from 'src/projects/entities/project.entity';

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
    const { email, password, name, projectId, username, phone_number, roleId, saldo } = user;
    const findEmail: User = await this.userRepository.findOne({
      where: {
        email
      }
    })
    if (findEmail) throw new ConflictException(`${email} is already created user. Create another user.`);
    const hashPassword: string = await this.authService.hashPassword(password);
    const saveProject: Project = await this.projectRepository.save({ id: projectId });
    const saveRole: RoleEntity = await this.roleRepository.save({ id: roleId });
    return this.userRepository.save({ email, name, username, password: hashPassword, phone_number, saldo,  project: saveProject, role: saveRole });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role', 'project', 'absence'] });
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
}
