import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedMinOrderValue1751286597792 implements MigrationInterface {
    name = 'AddedMinOrderValue1751286597792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "zone" RENAME COLUMN "minDeliveryCharges" TO "minOrderValue"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "zone" RENAME COLUMN "minOrderValue" TO "minDeliveryCharges"`);
    }

}
