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

// AMBIL DATA RESTAURANT
const restaurant =
  await this.prisma.restaurant.findUnique({
    where: {
      id: dto.restaurantId,
    },
  });

if (!restaurant) {
  throw new BadRequestException(
    'Restaurant not found',
  );
}

// VALIDASI JAM RESTAURANT
const reservationDate =
  new Date(dto.reservationDate);

const reservationHour =
  parseInt(
    dto.reservationTime.split(':')[0],
  );
  
function convertTo24Hour(
  time: string,
): number {
  const [hourStr, period] =
    time.trim().split(' ');

  let hour =
    parseInt(hourStr);

  if (
    period.toUpperCase() === 'PM' &&
    hour !== 12
  ) {
    hour += 12;
  }

  if (
    period.toUpperCase() === 'AM' &&
    hour === 12
  ) {
    hour = 0;
  }

  return hour;
}

if (
  !restaurant.openTime ||
  !restaurant.closeTime
) {
  throw new BadRequestException(
    'Restaurant opening hours not set',
  );
}

const openHour =
  convertTo24Hour(
    restaurant.openTime,
  );

const closeHour =
  convertTo24Hour(
    restaurant.closeTime,
  );

let isOpen = false;

// contoh:
// 6 AM - 10 PM
if (
  openHour < closeHour
) {
  isOpen =
    reservationHour >= openHour &&
    reservationHour < closeHour;
}

// contoh:
// 10 AM - 1 AM
else {
  isOpen =
    reservationHour >= openHour ||
    reservationHour < closeHour;
}

if (!isOpen) {
  throw new BadRequestException(
    `Restaurant only open from ${restaurant.openTime} - ${restaurant.closeTime}`,
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

  // GET DETAIL RESERVATION
async findOne(id: number) {
  const reservation =
    await this.prisma.reservation.findUnique({
      where: {
        id,
      },

      include: {
        user: true,
        restaurant: true,
        table: true,
      },
    });

  if (!reservation) {
    throw new BadRequestException(
      'Reservation not found',
    );
  }

  return reservation;
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