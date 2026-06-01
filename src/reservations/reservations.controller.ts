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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buat reservasi baru' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReservationDto, @Req() req) {
    return this.reservationsService.create(dto, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lihat reservasi milik user yang sedang login' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyReservations(@Req() req) {
    return this.reservationsService.findMyReservations(req.user.id);
  }

  @ApiOperation({ summary: 'Lihat semua reservasi (Admin)' })
@Get()
findAll(@Query('status') status?: string) {
  return this.reservationsService.findAll(status);
}

@ApiOperation({ summary: 'Lihat detail reservasi' })
@Get(':id')
findOne(@Param('id') id: string) {
  return this.reservationsService.findOne(+id);
}

@ApiOperation({ summary: 'Upload bukti pembayaran' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: { type: 'string', format: 'binary' },
    },
  },
})
@Post('upload-payment/:id')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueName =
          Date.now() + '-' + file.originalname;
        callback(null, uniqueName);
      },
    }),
  }),
)
uploadPayment(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.reservationsService.uploadPayment(
    +id,
    file.filename,
  );
}

  @ApiOperation({ summary: 'Konfirmasi pembayaran (Admin)' })
  @Patch('confirm/:id')
  confirmPayment(@Param('id') id: string) {
    return this.reservationsService.confirmPayment(+id);
  }

  @ApiOperation({ summary: 'Batalkan reservasi' })
  @Patch('cancel/:id')
  cancelReservation(@Param('id') id: string) {
    return this.reservationsService.cancelReservation(+id);
  }

  @ApiOperation({ summary: 'Tolak pembayaran (Admin)' })
  @Patch('reject/:id')
  rejectPayment(@Param('id') id: string, @Body('reason') reason: string) {
    return this.reservationsService.rejectPayment(+id, reason);
  }
}