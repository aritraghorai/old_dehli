import { MigrationInterface, QueryRunner } from "typeorm";

export class Cart41706771883860 implements MigrationInterface {
    name = 'Cart41706771883860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "UQ_38adfe5eca85cb882f6dc0722cc" UNIQUE ("cart_id", "product_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "UQ_38adfe5eca85cb882f6dc0722cc"`);
    }

}
