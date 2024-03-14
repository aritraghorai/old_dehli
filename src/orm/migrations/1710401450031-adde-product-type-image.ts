import { MigrationInterface, QueryRunner } from "typeorm";

export class AddeProductTypeImage1710401450031 implements MigrationInterface {
    name = 'AddeProductTypeImage1710401450031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_type" ADD "imageId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_type" ADD CONSTRAINT "FK_cfb29ab706153ff6212e94ef7ec" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_type" DROP CONSTRAINT "FK_cfb29ab706153ff6212e94ef7ec"`);
        await queryRunner.query(`ALTER TABLE "product_type" DROP COLUMN "imageId"`);
    }

}
