import { MigrationInterface, QueryRunner } from "typeorm";

export class Appp1714480298750 implements MigrationInterface {
    name = 'Appp1714480298750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "image_id" uuid, "category_id" uuid, CONSTRAINT "PK_6d9e2570b3d85ba37b681cd4256" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "banner" ADD CONSTRAINT "FK_b70568cfd42cccb0caaeb2bcce1" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "banner" ADD CONSTRAINT "FK_659f83956e19ac47152c09f245e" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner" DROP CONSTRAINT "FK_659f83956e19ac47152c09f245e"`);
        await queryRunner.query(`ALTER TABLE "banner" DROP CONSTRAINT "FK_b70568cfd42cccb0caaeb2bcce1"`);
        await queryRunner.query(`DROP TABLE "banner"`);
    }

}
