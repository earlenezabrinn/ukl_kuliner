export class CreateRestaurantDto {
  name!: string;
  location!: string;
  description!: string;
  dpAmount!: number;
  bankName!: string;
  bankAccount!: string;
  accountName!: string;
  openTime!: string;
  closeTime!: string;
  closedDay?: string;
  image?: string;
}