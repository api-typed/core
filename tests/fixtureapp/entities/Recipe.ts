import { Column, Entity } from 'typeorm';
import { ApiResource } from '../../../src';
import { BaseEntity } from './BaseEntity';

@Entity()
@ApiResource({
  sortDefault: {
    id: 'ASC',
  },
})
export class Recipe extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public complexity: number;

  @Column()
  public timeRequired: number;
}
