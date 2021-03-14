import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiResource } from '../../../src';

@Entity()
@ApiResource({
  path: '/recipe-ingredients',
})
export class Ingredient {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: number;
}
