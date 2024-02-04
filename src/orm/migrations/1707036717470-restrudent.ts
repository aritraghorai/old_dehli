import { MigrationInterface, QueryRunner } from "typeorm";

export class Restrudent1707036717470 implements MigrationInterface {
    name = 'Restrudent1707036717470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7bc84b5c963fa67c7a9668655c1" UNIQUE ("slug"), CONSTRAINT "UQ_f0640e30fef1d175426d80dbc13" UNIQUE ("name"), CONSTRAINT "PK_ad47b7c6121fe31cb4b05438e44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restruent_image" ("shopId" uuid NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "PK_ffa51bc773a971fb593394aaa61" PRIMARY KEY ("shopId", "imageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d32e4ea2c5ad2de92ce6671c5d" ON "restruent_image" ("shopId") `);
        await queryRunner.query(`CREATE INDEX "IDX_08cd8019a8b64692c8e58635b9" ON "restruent_image" ("imageId") `);
        await queryRunner.query(`ALTER TABLE "product" ADD "shopId" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_1c4b1934c3e8c5b69b3d3d311d6" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restruent_image" ADD CONSTRAINT "FK_d32e4ea2c5ad2de92ce6671c5d7" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "restruent_image" ADD CONSTRAINT "FK_08cd8019a8b64692c8e58635b99" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restruent_image" DROP CONSTRAINT "FK_08cd8019a8b64692c8e58635b99"`);
        await queryRunner.query(`ALTER TABLE "restruent_image" DROP CONSTRAINT "FK_d32e4ea2c5ad2de92ce6671c5d7"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_1c4b1934c3e8c5b69b3d3d311d6"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "shopId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08cd8019a8b64692c8e58635b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d32e4ea2c5ad2de92ce6671c5d"`);
        await queryRunner.query(`DROP TABLE "restruent_image"`);
        await queryRunner.query(`DROP TABLE "shop"`);
    }

}
