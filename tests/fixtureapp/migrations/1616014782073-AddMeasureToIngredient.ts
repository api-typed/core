import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMeasureToIngredient1616014782073 implements MigrationInterface {
  name = 'AddMeasureToIngredient1616014782073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "ingredient_measure_enum" AS ENUM('g', 'l', 'spoon', 'pinch')
        `);
    await queryRunner.query(`
            ALTER TABLE "ingredient"
            ADD "measure" "ingredient_measure_enum" NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "ingredient"
            ADD "minMeasure" numeric(4, 2)
        `);
    await queryRunner.query(`
            ALTER TABLE "ingredient"
            ADD "maxMeasure" numeric(4, 2)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "ingredient" DROP COLUMN "maxMeasure"
        `);
    await queryRunner.query(`
            ALTER TABLE "ingredient" DROP COLUMN "minMeasure"
        `);
    await queryRunner.query(`
            ALTER TABLE "ingredient" DROP COLUMN "measure"
        `);
    await queryRunner.query(`
            DROP TYPE "ingredient_measure_enum"
        `);
  }
}
