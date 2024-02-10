import { MigrationInterface, QueryRunner } from "typeorm";

export class Order21707590836773 implements MigrationInterface {
    name = 'Order21707590836773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "orderId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderId"`);
    }

}
