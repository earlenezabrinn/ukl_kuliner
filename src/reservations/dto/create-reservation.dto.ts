import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: '2026-06-01' })
  @IsString()
  reservationDate!: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  totalPeople!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  restaurantId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  tableId!: number;

  @ApiProperty({ example: 'TRANSFER' })
  @IsString()
  paymentMethod!: string;
}