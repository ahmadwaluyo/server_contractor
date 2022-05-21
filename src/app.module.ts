import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { ProjectsModule } from './projects/projects.module';
import { AbsenceModule } from './absence/absence.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    RoleModule,
    AuthModule,
    ProjectsModule,
    AbsenceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
