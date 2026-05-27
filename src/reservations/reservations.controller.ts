import {
  Body,
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private reservationsService: ReservationsService,
  ) {}

  // USER CREATE RESERVATION
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateReservationDto,
    @Req() req,
  ) {
    return this.reservationsService.create(
      dto,
      req.user.id,
    );
  }

  // USER GET OWN RESERVATION
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyReservations(@Req() req) {
    return this.reservationsService.findMyReservations(
      req.user.id,
    );
  }

  // ADMIN GET ALL RESERVATION
  @Get()
findAll(
  @Query('status')
  status?: string,
) {
  return this.reservationsService.findAll(
    status,
  );
}

  // USER UPLOAD PAYMENT
  @Post('upload-payment/:id')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',

      filename: (
        req,
        file,
        callback,
      ) => {
        const uniqueName =
          Date.now() +
          '-' +
          file.originalname;

        callback(null, uniqueName);
      },
    }),
  }),
)
uploadPayment(
  @Param('id') id: string,

  @UploadedFile()
  file: Express.Multer.File,
) {
  return this.reservationsService.uploadPayment(
    +id,
    file.filename,
  );
}

  // ADMIN CONFIRM PAYMENT
  @Patch('confirm/:id')
  confirmPayment(
    @Param('id') id: string,
  ) {
    return this.reservationsService.confirmPayment(
      +id,
    );
  }

  @Patch('cancel/:id')
cancelReservation(
  @Param('id') id: string,
) {
  return this.reservationsService.cancelReservation(
    +id,
  );
}

  // ADMIN REJECT PAYMENT
  @Patch('reject/:id')
  rejectPayment(
    @Param('id') id: string,

    @Body('reason')
    reason: string,
  ) {
    return this.reservationsService.rejectPayment(
      +id,
      reason,
    );
  }
}