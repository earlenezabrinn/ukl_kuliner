import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty({ example: 1 })
  tableNumber!: number;

  @ApiProperty({ example: 4 })
  capacity!: number;

  @ApiProperty({ example: 'INDOOR' })
  locationType!: string;

  @ApiProperty({ example: 1 })
  restaurantId!: number;
}