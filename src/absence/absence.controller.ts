import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AbsenceService } from './absence.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';

@Controller('absence')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAbsenceDto: CreateAbsenceDto) {
    return this.absenceService.create(createAbsenceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.absenceService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:id')
  findOne(@Param('id') id: string) {
    return this.absenceService.findAbsenceByUserId(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/project/:id')
  find(@Param('id') id: string) {
    return this.absenceService.findAbsenceByProjectId(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/clock_in/:userId/:date')
  findBy(@Param('userId') userId: string, @Param('date') date: Date) {
    return this.absenceService.findAbsenceByClockIn(+userId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAbsenceDto: UpdateAbsenceDto) {
    return this.absenceService.update(+id, updateAbsenceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.absenceService.remove(+id);
  }
}
