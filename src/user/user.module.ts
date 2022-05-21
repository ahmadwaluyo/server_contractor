import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { User } from './entity/user.entity';
import { UserService } from './service/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { RoleEntity } from 'src/role/entities/role.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Absence } from 'src/absence/entities/absence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([RoleEntity]),
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([Absence]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }