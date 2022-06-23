import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/project/:id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findBy(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/cashbond/:id')
  findBy(@Param('id') id: string) {
    return this.transactionsService.findCashbond(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
