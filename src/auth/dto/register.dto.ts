import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Budi Santoso' })
  name!: string;

  @ApiProperty({ example: 'budi@gmail.com' })
  email!: string;

  @ApiProperty({ example: 'password123' })
  password!: string;
}