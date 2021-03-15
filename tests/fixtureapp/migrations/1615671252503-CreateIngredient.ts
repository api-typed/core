import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIngredient1615671252503 implements MigrationInterface {
  name = 'CreateIngredient1615671252503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "ingredient" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "ingredient"
        `);
  }
}
