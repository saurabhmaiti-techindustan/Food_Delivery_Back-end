import { IsNotEmpty } from 'class-validator';

export class CreateRestaurantDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  address: string;

}