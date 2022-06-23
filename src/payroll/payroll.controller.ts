import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPayrollDto: CreatePayrollDto) {
    return this.payrollService.create(createPayrollDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.payrollService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.payrollService.findPayrollByUserId(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayrollDto: UpdatePayrollDto) {
    return this.payrollService.update(+id, updatePayrollDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollService.remove(+id);
  }
}
