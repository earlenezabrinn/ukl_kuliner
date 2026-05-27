import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateReservationDto } from './dto/create-reservation.dto';

import {
  PaymentStatus,
  TableStatus,
} from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // CREATE RESERVATION
  async create(
    dto: CreateReservationDto,
    userId: number,
  ) {
    // CEK TABLE
    const table =
      await this.prisma.table.findUnique({
        where: {
          id: dto.tableId,
        },
      });

    if (!table) {
      throw new BadRequestException(
        'Table not found',
      );
    }

    // VALIDASI KAPASITAS
    if (
      dto.totalPeople >
      table.capacity
    ) {
      throw new BadRequestException(
        'Total people exceeds table capacity',
      );
    }

    // VALIDASI RESTAURANT
    if (
      table.restaurantId !==
      dto.restaurantId
    ) {
      throw new BadRequestException(
        'Table does not belong to this restaurant',
      );
    }

    // VALIDASI JAM
    const reservationDate =
      new Date(
        dto.reservationDate,
      );

    const hour =
      reservationDate.getHours();

    if (
      hour < 10 ||
      hour > 22
    ) {
      throw new BadRequestException(
        'Restaurant only open from 10:00 - 22:00',
      );
    }

    // VALIDASI DOUBLE BOOKING
    const existingReservation =
      await this.prisma.reservation.findFirst({
        where: {
          tableId:
            dto.tableId,

          reservationDate,
        },
      });

    if (existingReservation) {
      throw new BadRequestException(
        'Table already reserved at this time',
      );
    }

    // UPDATE STATUS TABLE
    await this.prisma.table.update({
      where: {
        id: dto.tableId,
      },

      data: {
        status:
          TableStatus.BOOKED,
      },
    });

    // CREATE RESERVATION
    return this.prisma.reservation.create({
      data: {
        reservationDate,

        totalPeople:
          dto.totalPeople,

        paymentStatus:
          PaymentStatus.PENDING,

        paymentMethod:
          dto.paymentMethod,

        user: {
          connect: {
            id: userId,
          },
        },

        restaurant: {
          connect: {
            id:
              dto.restaurantId,
          },
        },

        table: {
          connect: {
            id: dto.tableId,
          },
        },
      },

      include: {
        user: true,
        restaurant: true,
        table: true,
      },
    });
  }

  // GET ALL RESERVATION
  async findAll(
    status?: string,
  ) {
    return this.prisma.reservation.findMany({
      where: status
        ? {
            paymentStatus:
              status as any,
          }
        : {},

      include: {
        user: true,
        restaurant: true,
        table: true,
      },
    });
  }

  // GET MY RESERVATION
  async findMyReservations(
    userId: number,
  ) {
    return this.prisma.reservation.findMany({
      where: {
        userId,
      },

      include: {
        restaurant: true,
        table: true,
      },
    });
  }

  // UPLOAD PAYMENT
  async uploadPayment(
    id: number,
    filename: string,
  ) {
    return this.prisma.reservation.update({
      where: {
        id,
      },

      data: {
        paymentProof:
          filename,

        paymentStatus:
          PaymentStatus.WAITING_CONFIRMATION,
      },
    });
  }

  // CONFIRM PAYMENT
  async confirmPayment(
    id: number,
  ) {
    return this.prisma.reservation.update({
      where: {
        id,
      },

      data: {
        paymentStatus:
          PaymentStatus.PAID,

        rejectReason:
          null,
      },
    });
  }

  // REJECT PAYMENT
  async rejectPayment(
    id: number,
    reason: string,
  ) {
    return this.prisma.reservation.update({
      where: {
        id,
      },

      data: {
        paymentStatus:
          PaymentStatus.REJECTED,

        rejectReason:
          reason,
      },
    });
  }

  // CANCEL RESERVATION
  async cancelReservation(
    id: number,
  ) {
    const reservation =
      await this.prisma.reservation.findUnique({
        where: {
          id,
        },
      });

    if (!reservation) {
      throw new BadRequestException(
        'Reservation not found',
      );
    }

    // BALIKIN STATUS TABLE
    await this.prisma.table.update({
      where: {
        id:
          reservation.tableId,
      },

      data: {
        status:
          TableStatus.AVAILABLE,
      },
    });

    // UPDATE STATUS RESERVATION
    return this.prisma.reservation.update({
      where: {
        id,
      },

      data: {
        paymentStatus:
          PaymentStatus.CANCELLED,
      },
    });
  }
}