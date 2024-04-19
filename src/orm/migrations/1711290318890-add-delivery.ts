import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDelivery1711290318890 implements MigrationInterface {
    name = 'AddDelivery1711290318890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryCharge" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "razorpay_payment" ALTER COLUMN "paymentId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "razorpay_payment" ALTER COLUMN "paymentId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryCharge"`);
    }

}
