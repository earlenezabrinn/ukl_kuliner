import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getDashboard() {
    const totalRestaurants =
      await this.prisma.restaurant.count();

    const totalUsers =
      await this.prisma.user.count();

    const totalReservations =
      await this.prisma.reservation.count();

    const totalPaid =
      await this.prisma.reservation.count({
        where: {
          paymentStatus: 'PAID',
        },
      });

    return {
      totalRestaurants,
      totalUsers,
      totalReservations,
      totalPaid,
    };
  }
}
