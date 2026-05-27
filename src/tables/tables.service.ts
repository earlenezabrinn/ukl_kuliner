import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { TableStatus } from '@prisma/client';

@Injectable()
export class TablesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // CREATE TABLE
  async create(dto: CreateTableDto) {
    return this.prisma.table.create({
      data: {
        tableNumber: dto.tableNumber,
        capacity: dto.capacity,
        locationType: dto.locationType,
        restaurantId: dto.restaurantId,
      },
    });
  }

  // GET ALL TABLES
  async findAll() {
    return this.prisma.table.findMany({
      include: {
        restaurant: true,
      },
    });
  }

  async findAvailableTables() {
  return this.prisma.table.findMany({
    where: {
      status: TableStatus.AVAILABLE,
    },

    include: {
      restaurant: true,
    },
  });
}

  // GET TABLE BY RESTAURANT
  async findByRestaurant(restaurantId: number) {
    return this.prisma.table.findMany({
      where: {
        restaurantId,
      },
    });
  }

  // GET DETAIL TABLE
  async findOne(id: number) {
    const table =
      await this.prisma.table.findUnique({
        where: { id },

        include: {
          restaurant: true,
        },
      });

    if (!table) {
      throw new NotFoundException(
        'Table tidak ditemukan',
      );
    }

    return table;
  }

  // UPDATE TABLE
  async update(
    id: number,
    dto: CreateTableDto,
  ) {
    const table =
      await this.prisma.table.findUnique({
        where: { id },
      });

    if (!table) {
      throw new NotFoundException(
        'Table tidak ditemukan',
      );
    }

    return this.prisma.table.update({
      where: { id },

      data: {
        tableNumber: dto.tableNumber,
        capacity: dto.capacity,
        locationType: dto.locationType,
        restaurantId: dto.restaurantId,
      },
    });
  }

  // DELETE TABLE
  async remove(id: number) {
    const table =
      await this.prisma.table.findUnique({
        where: { id },
      });

    if (!table) {
      throw new NotFoundException(
        'Table tidak ditemukan',
      );
    }

    return this.prisma.table.delete({
      where: { id },
    });
  }
}
