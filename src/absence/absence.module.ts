import { forwardRef, Module } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { AbsenceController } from './absence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Absence } from './entities/absence.entity';
import { User } from 'src/user/entity/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Absence]),
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AbsenceController],
  providers: [AbsenceService],
  exports: [AbsenceService],
})
export class AbsenceModule {}
