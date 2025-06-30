import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedMinOrderValue1751284729185 implements MigrationInterface {
    name = 'AddedMinOrderValue1751284729185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "zone" ADD "minDeliveryCharges" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "zone" DROP COLUMN "minDeliveryCharges"`);
    }

}
