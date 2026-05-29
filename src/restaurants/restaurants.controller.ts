import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @ApiOperation({ summary: 'Lihat semua restoran' })
  @Get()
  findAll(@Query('search') search?: string, @Query('sort') sort?: string) {
    return this.restaurantsService.findAll(search, sort);
  }

  @ApiOperation({ summary: 'Lihat detail restoran' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(Number(id));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tambah restoran baru (Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Warung Bali Indah' },
        location: { type: 'string', example: 'Jl. Raya Kuta No. 25, Bali' },
        description: { type: 'string', example: 'Restoran dengan suasana tradisional Bali' },
        dpAmount: { type: 'number', example: 50000 },
        bankName: { type: 'string', example: 'BCA' },
        bankAccount: { type: 'string', example: '1234567890' },
        accountName: { type: 'string', example: 'Budi Santoso' },
        openTime: { type: 'string', example: '08:00' },
        closeTime: { type: 'string', example: '22:00' },
        closedDay: { type: 'string', example: 'Senin' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const fileName = file.originalname
          .replace(/\s+/g, '-')
          .toLowerCase();

        callback(null, fileName);
      },
    }),
  }),
)
  create(@Body() dto: CreateRestaurantDto, @UploadedFile() image: Express.Multer.File) {
    return this.restaurantsService.create(dto, image);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update restoran (Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Warung Bali Indah' },
        location: { type: 'string', example: 'Jl. Raya Kuta No. 25, Bali' },
        description: { type: 'string', example: 'Restoran dengan suasana tradisional Bali' },
        dpAmount: { type: 'number', example: 50000 },
        bankName: { type: 'string', example: 'BCA' },
        bankAccount: { type: 'string', example: '1234567890' },
        accountName: { type: 'string', example: 'Budi Santoso' },
        openTime: { type: 'string', example: '08:00' },
        closeTime: { type: 'string', example: '22:00' },
        closedDay: { type: 'string', example: 'Senin' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @Put(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const fileName = file.originalname
          .replace(/\s+/g, '-')
          .toLowerCase();

        callback(null, fileName);
      },
    }),
  }),
)
  update(
    @Param('id') id: string,
    @Body() dto: CreateRestaurantDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.restaurantsService.update(Number(id), dto, image);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus restoran (Admin)' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(Number(id));
  }
}