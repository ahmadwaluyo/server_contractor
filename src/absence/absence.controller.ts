import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';

@Controller('absence')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Post()
  create(@Body() createAbsenceDto: CreateAbsenceDto) {
    return this.absenceService.create(createAbsenceDto);
  }

  @Get()
  findAll() {
    return this.absenceService.findAll();
  }

  @Get('/user/:id')
  findOne(@Param('id') id: string) {
    return this.absenceService.findAbsenceByUserId(+id);
  }

  @Get('/project/:id')
  find(@Param('id') id: string) {
    return this.absenceService.findAbsenceByProjectId(+id);
  }

  @Get('/clock_in/:userId/:date')
  findBy(@Param('userId') userId: string, @Param('date') date: Date) {
    return this.absenceService.findAbsenceByClockIn(+userId, date);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAbsenceDto: UpdateAbsenceDto) {
    return this.absenceService.update(+id, updateAbsenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.absenceService.remove(+id);
  }
}
