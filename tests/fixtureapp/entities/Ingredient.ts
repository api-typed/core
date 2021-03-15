import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiResource, Operation } from '../../../src';

@Entity()
@ApiResource({
  path: '/recipe-ingredients',
  operations: [Operation.List, Operation.Create, Operation.Read],
})
export class Ingredient {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;
}
