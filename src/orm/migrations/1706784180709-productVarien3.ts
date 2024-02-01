import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductVarien31706784180709 implements MigrationInterface {
    name = 'ProductVarien31706784180709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "UQ_f972a98658f60ca2de82c2f4311"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD "optionId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "UQ_8652206850de57443dbd9b9bb0f" UNIQUE ("productItemId", "optionValueId", "optionId")`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "FK_31c66c798f0280b478199cfb01b" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "FK_31c66c798f0280b478199cfb01b"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "UQ_8652206850de57443dbd9b9bb0f"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP COLUMN "optionId"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "UQ_f972a98658f60ca2de82c2f4311" UNIQUE ("productItemId", "optionValueId")`);
    }

}
