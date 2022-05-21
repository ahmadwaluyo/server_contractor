import { Body, Controller, Get, Post, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../dto/user.dto';
import { LoginUserDto } from '../dto/user.login-dto';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userServices: UserService) { }

  @Post('/login')
  // @UseGuards(AuthGuard('local'))
  async login(@Body() body): Promise<LoginUserDto> {
    return this.userServices.login(body);
  }

  @Post()
  createUser(@Body() user: UserDto): Promise<User> {
    return this.userServices.create(user);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userServices.findAll();
  }

  @Get('/:userId')
  findUserById (@Param('userId') userId: number): Promise<User>{
      return this.userServices.findUserById(userId);
  }
}
