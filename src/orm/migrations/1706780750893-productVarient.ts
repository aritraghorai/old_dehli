import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductVarient1706780750893 implements MigrationInterface {
    name = 'ProductVarient1706780750893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_item" DROP CONSTRAINT "FK_a2b8baaf8a535217af0e215bc31"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "FK_31c66c798f0280b478199cfb01b"`);
        await queryRunner.query(`ALTER TABLE "product_item" DROP CONSTRAINT "UQ_e23f7aaad56b6baf547910b6bfa"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" RENAME COLUMN "optionId" TO "productItemId"`);
        await queryRunner.query(`ALTER TABLE "product_item" DROP COLUMN "productConfigId"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "UQ_f972a98658f60ca2de82c2f4311" UNIQUE ("productItemId", "optionValueId")`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "FK_5aa7494074e312d6c51b5db6b1b" FOREIGN KEY ("productItemId") REFERENCES "product_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "FK_5aa7494074e312d6c51b5db6b1b"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "UQ_f972a98658f60ca2de82c2f4311"`);
        await queryRunner.query(`ALTER TABLE "product_item" ADD "productConfigId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" RENAME COLUMN "productItemId" TO "optionId"`);
        await queryRunner.query(`ALTER TABLE "product_item" ADD CONSTRAINT "UQ_e23f7aaad56b6baf547910b6bfa" UNIQUE ("productId", "productConfigId")`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "FK_31c66c798f0280b478199cfb01b" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_item" ADD CONSTRAINT "FK_a2b8baaf8a535217af0e215bc31" FOREIGN KEY ("productConfigId") REFERENCES "product_cofiguration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
