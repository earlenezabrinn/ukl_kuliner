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

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
  ) {}

  // GET ALL + SEARCH
  @Get()
findAll(
  @Query('search')
  search?: string,

  @Query('sort')
  sort?: string,
) {
  return this.restaurantsService.findAll(
    search,
    sort,
  );
}
  

  // GET DETAIL
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.restaurantsService.findOne(
      Number(id),
    );
  }

  // CREATE RESTAURANT
  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',

        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName =
            Date.now() +
            extname(
              file.originalname,
            );

          callback(
            null,
            uniqueName,
          );
        },
      }),
    }),
  )
  create(
    @Body()
    dto: CreateRestaurantDto,

    @UploadedFile()
    image: Express.Multer.File,
  ) {
    return this.restaurantsService.create(
      dto,
      image,
    );
  }

  // UPDATE RESTAURANT
  @Put(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',

        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName =
            Date.now() +
            extname(
              file.originalname,
            );

          callback(
            null,
            uniqueName,
          );
        },
      }),
    }),
  )
  update(
    @Param('id')
    id: string,

    @Body()
    dto: CreateRestaurantDto,

    @UploadedFile()
    image: Express.Multer.File,
  ) {
    return this.restaurantsService.update(
      Number(id),
      dto,
      image,
    );
  }

  // DELETE RESTAURANT
  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.restaurantsService.remove(
      Number(id),
    );
  }
}