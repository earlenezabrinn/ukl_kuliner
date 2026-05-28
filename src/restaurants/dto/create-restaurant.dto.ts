import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Warung Bali Indah' })
  name!: string;

  @ApiProperty({ example: 'Jl. Raya Kuta No. 25, Bali' })
  location!: string;

  @ApiProperty({ example: 'Restoran dengan suasana tradisional Bali' })
  description!: string;

  @ApiProperty({ example: 50000 })
  dpAmount!: number;

  @ApiProperty({ example: 'BCA' })
  bankName!: string;

  @ApiProperty({ example: '1234567890' })
  bankAccount!: string;

  @ApiProperty({ example: 'Budi Santoso' })
  accountName!: string;

  @ApiProperty({ example: '08:00' })
  openTime!: string;

  @ApiProperty({ example: '22:00' })
  closeTime!: string;

  @ApiPropertyOptional({ example: 'Senin' })
  closedDay?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  image?: string;
}