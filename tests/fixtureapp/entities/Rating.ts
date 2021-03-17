import { Column, Entity } from 'typeorm';
import { ApiResource } from '../../../src';
import { BaseEntity } from './BaseEntity';

@Entity()
@ApiResource({
  operations: [],
})
export class Rating extends BaseEntity {
  @Column()
  public rating: number;
}
