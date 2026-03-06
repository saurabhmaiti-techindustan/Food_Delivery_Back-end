import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './entities/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantsService {
    constructor(@InjectRepository(RestaurantEntity)private readonly restaurantRepository:Repository<RestaurantEntity>){

    }
async createRestaurant(createRestaurantdto: CreateRestaurantDto, ownerId: number) {

  const restaurant = this.restaurantRepository.create({
    ...createRestaurantdto,
    owner: { id: ownerId }
  });
  return this.restaurantRepository.save(restaurant);
}
}
