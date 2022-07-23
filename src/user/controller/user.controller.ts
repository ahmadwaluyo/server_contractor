import { Body, Controller, Get, Post, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { LoginUserDto } from '../dto/user.login-dto';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userServices: UserService) { }

  @Post('/login')
  async login(@Body() body): Promise<LoginUserDto> {
    return this.userServices.login(body);
  }

  @Get('/username/:username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.userServices.findUsernameForPublic(username);
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  createUser(@Body() user: UserDto): Promise<User> {
    return this.userServices.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userServices.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  findUserById (@Param('userId') userId: number): Promise<User>{
      return this.userServices.findUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('role/:roleId')
  findOne (@Param('roleId') roleId: number): Promise<User>{
    return this.userServices.findUserByRoleId(roleId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userServices.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userServices.remove(+id);
  }
}
