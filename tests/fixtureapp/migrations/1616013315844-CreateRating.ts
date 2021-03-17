import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRating1616013315844 implements MigrationInterface {
  name = 'CreateRating1616013315844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "rating" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "rating" integer NOT NULL,
                CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "rating"
        `);
  }
}
