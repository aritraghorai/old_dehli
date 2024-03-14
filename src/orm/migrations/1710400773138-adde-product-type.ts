import { MigrationInterface, QueryRunner } from "typeorm";

export class AddeProductType1710400773138 implements MigrationInterface {
    name = 'AddeProductType1710400773138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_8a12e4cb68bc526f8d8e59efb12"`);
        await queryRunner.query(`ALTER TABLE "restruent_image" DROP CONSTRAINT "FK_d32e4ea2c5ad2de92ce6671c5d7"`);
        await queryRunner.query(`CREATE TABLE "product_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9ea6957ecb3677204c580411f7f" UNIQUE ("slug"), CONSTRAINT "PK_e0843930fbb8854fe36ca39dae1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD "productTypeId" uuid`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_8a12e4cb68bc526f8d8e59efb12" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98" FOREIGN KEY ("productTypeId") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restruent_image" ADD CONSTRAINT "FK_d32e4ea2c5ad2de92ce6671c5d7" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restruent_image" DROP CONSTRAINT "FK_d32e4ea2c5ad2de92ce6671c5d7"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_8a12e4cb68bc526f8d8e59efb12"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productTypeId"`);
        await queryRunner.query(`DROP TABLE "product_type"`);
        await queryRunner.query(`ALTER TABLE "restruent_image" ADD CONSTRAINT "FK_d32e4ea2c5ad2de92ce6671c5d7" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_8a12e4cb68bc526f8d8e59efb12" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
