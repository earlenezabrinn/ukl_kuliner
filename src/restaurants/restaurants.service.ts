import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // CREATE RESTAURANT
  // CREATE RESTAURANT
async create(
  dto: CreateRestaurantDto,
  image: Express.Multer.File,
) {
  return this.prisma.restaurant.create({
    data: {
      name: dto.name,
      location: dto.location,
      description: dto.description,
      dpAmount: Number(dto.dpAmount),
      bankName: dto.bankName,
      bankAccount: dto.bankAccount,
      accountName: dto.accountName,
      openTime: dto.openTime,
      closeTime: dto.closeTime,
      closedDay: dto.closedDay,
      image:
        image?.filename || null,
    },
  });
}

  // GET ALL RESTAURANT
  async findAll(
  search?: string,
  sort?: string,
) {
  return this.prisma.restaurant.findMany({
    where: search
      ? {
          OR: [
            {
              name: {
                contains: search,
              },
            },

            {
              location: {
                contains: search,
              },
            },

            {
              description: {
                contains: search,
              },
            },
          ],
        }
      : {},

    orderBy:
      sort === 'dp'
        ? {
            dpAmount: 'asc',
          }
        : sort === 'name'
        ? {
            name: 'asc',
          }
        : undefined,

    include: {
      tables: true,
    },
  });
}

  // GET DETAIL RESTAURANT
  async findOne(id: number) {
    const restaurant =
      await this.prisma.restaurant.findUnique({
        where: { id },

        include: {
          tables: true,
          reservations: true,
        },
      });

    if (!restaurant) {
      throw new NotFoundException(
        'Restaurant tidak ditemukan',
      );
    }

    return restaurant;
  }


  // UPDATE RESTAURANT
async update(
  id: number,
  dto: CreateRestaurantDto,
  image: Express.Multer.File,
) {
  const restaurant =
    await this.prisma.restaurant.findUnique({
      where: { id },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'Restaurant tidak ditemukan',
    );
  }

  return this.prisma.restaurant.update({
    where: { id },

    data: {
      name: dto.name,

      location: dto.location,

      description: dto.description,

      dpAmount: Number(dto.dpAmount),

      bankName: dto.bankName,

      bankAccount: dto.bankAccount,

      accountName: dto.accountName,

      openTime: dto.openTime,

      closeTime: dto.closeTime,

      closedDay: dto.closedDay,

      image:
        image?.filename ||
        restaurant.image,
    },
  });
}

  // DELETE RESTAURANT
  async remove(id: number) {
    const restaurant =
      await this.prisma.restaurant.findUnique({
        where: { id },
      });

    if (!restaurant) {
      throw new NotFoundException(
        'Restaurant tidak ditemukan',
      );
    }

    return this.prisma.restaurant.delete({
      where: { id },
    });
  }
}