import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecipe1615717017107 implements MigrationInterface {
  name = 'CreateRecipe1615717017107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "recipe" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "description" character varying NOT NULL,
                "complexity" integer NOT NULL,
                "timeRequired" integer NOT NULL,
                CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "recipe"
        `);
  }
}
