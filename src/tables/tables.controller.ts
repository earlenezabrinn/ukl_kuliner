import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { TablesService } from './tables.service';

import { CreateTableDto } from './dto/create-table.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tables')
export class TablesController {
  constructor(
    private readonly tablesService: TablesService,
  ) {}

  // GET ALL TABLES
  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get('available')
findAvailableTables() {
  return this.tablesService.findAvailableTables();
}

  // GET TABLE BY RESTAURANT
  @Get('restaurant/:restaurantId')
  findByRestaurant(
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.tablesService.findByRestaurant(
      Number(restaurantId),
    );
  }

  // GET DETAIL TABLE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(Number(id));
  }

  // CREATE TABLE
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  // UPDATE TABLE
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() dto: CreateTableDto,
  ) {
    return this.tablesService.update(
      Number(id),
      dto,
    );
  }

  // DELETE TABLE
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(Number(id));
  }
}