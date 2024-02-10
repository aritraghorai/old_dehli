import { MigrationInterface, QueryRunner } from "typeorm";

export class Order31707592290585 implements MigrationInterface {
    name = 'Order31707592290585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "orderNumber" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "orderNumber" SET NOT NULL`);
    }

}
