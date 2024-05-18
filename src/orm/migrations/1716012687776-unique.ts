import { MigrationInterface, QueryRunner } from "typeorm";

export class Unique1716012687776 implements MigrationInterface {
    name = 'Unique1716012687776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner" ADD "position" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "priority" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`CREATE INDEX "IDX_dd318c338e5744a5523195cc0f" ON "product" ("priority") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_dd318c338e5744a5523195cc0f"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "priority"`);
        await queryRunner.query(`ALTER TABLE "banner" DROP COLUMN "position"`);
    }

}
