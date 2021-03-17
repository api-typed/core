import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiResource } from '../../../src';

export enum Measure {
  kg = 'g',
  l = 'l',
  spoon = 'spoon',
  pinch = 'pinch',
}

@Entity()
@ApiResource({
  path: '/recipe-ingredients',
})
export class Ingredient {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @Column('enum', {
    enum: Measure,
  })
  @IsEnum(Measure)
  public measure: Measure;

  @Column('numeric', {
    nullable: true,
    precision: 4,
    scale: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99)
  public minMeasure: number;

  @Column('numeric', {
    nullable: true,
    precision: 4,
    scale: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99)
  public maxMeasure: number;
}
