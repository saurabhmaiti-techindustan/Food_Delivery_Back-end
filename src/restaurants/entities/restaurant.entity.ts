import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('restaurants')
export class RestaurantEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0,
  })
  rating: number;

  @Column({ default: false })
  isApproved: boolean;

@ManyToOne(() => UserEntity, (user) => user.restaurants)
owner: UserEntity;
}