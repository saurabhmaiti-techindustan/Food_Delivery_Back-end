import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './entities/restaurant.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([RestaurantEntity])
  ],
  providers: [RestaurantsService],
  controllers: [RestaurantsController]
})
export class RestaurantsModule {}
