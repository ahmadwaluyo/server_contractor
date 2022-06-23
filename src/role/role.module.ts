import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { User } from 'src/user/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}
