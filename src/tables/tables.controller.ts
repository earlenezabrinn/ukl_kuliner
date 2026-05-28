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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @ApiOperation({ summary: 'Lihat semua meja' })
  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @ApiOperation({ summary: 'Lihat meja yang tersedia' })
  @Get('available')
  findAvailableTables() {
    return this.tablesService.findAvailableTables();
  }

  @ApiOperation({ summary: 'Lihat meja berdasarkan restoran' })
  @Get('restaurant/:restaurantId')
  findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.tablesService.findByRestaurant(Number(restaurantId));
  }

  @ApiOperation({ summary: 'Lihat detail meja' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(Number(id));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tambah meja baru (Admin)' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update meja (Admin)' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: CreateTableDto) {
    return this.tablesService.update(Number(id), dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus meja (Admin)' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(Number(id));
  }
}