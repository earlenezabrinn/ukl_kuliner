import {
  IsInt,
  IsString,
} from 'class-validator';

export class CreateReservationDto {
  @IsString()
  reservationDate!: string;
  @IsInt()
  totalPeople!: number;
  @IsInt()
  restaurantId!: number;
  @IsInt()
  tableId!: number;
  @IsString()
  paymentMethod!: string;
}