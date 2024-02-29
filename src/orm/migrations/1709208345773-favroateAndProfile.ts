import { MigrationInterface, QueryRunner } from "typeorm";

export class FavroateAndProfile1709208345773 implements MigrationInterface {
    name = 'FavroateAndProfile1709208345773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "bio" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "image_id" uuid, CONSTRAINT "REL_938b0dfbabed6deaa4a9a91e91" UNIQUE ("image_id"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_favorite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_1d722c57635dc707eca7cf15af" UNIQUE ("user_id"), CONSTRAINT "PK_e161413fbdd7d2592f727858739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "favorite_id" uuid, "product_id" uuid, CONSTRAINT "REL_3eee7ce905fad8746dfb39c505" UNIQUE ("product_id"), CONSTRAINT "PK_fa18c8a7e7b3aa288ebd18885d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profile_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_f44d0cd18cfd80b0fed7806c3b7" UNIQUE ("profile_id")`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "FK_938b0dfbabed6deaa4a9a91e919" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f44d0cd18cfd80b0fed7806c3b7" FOREIGN KEY ("profile_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_favorite" ADD CONSTRAINT "FK_1d722c57635dc707eca7cf15af3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_item" ADD CONSTRAINT "FK_6d0231e4468108b7225921db8da" FOREIGN KEY ("favorite_id") REFERENCES "user_favorite"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_item" ADD CONSTRAINT "FK_3eee7ce905fad8746dfb39c505e" FOREIGN KEY ("product_id") REFERENCES "product_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_item" DROP CONSTRAINT "FK_3eee7ce905fad8746dfb39c505e"`);
        await queryRunner.query(`ALTER TABLE "favorite_item" DROP CONSTRAINT "FK_6d0231e4468108b7225921db8da"`);
        await queryRunner.query(`ALTER TABLE "user_favorite" DROP CONSTRAINT "FK_1d722c57635dc707eca7cf15af3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f44d0cd18cfd80b0fed7806c3b7"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "FK_938b0dfbabed6deaa4a9a91e919"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_f44d0cd18cfd80b0fed7806c3b7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_id"`);
        await queryRunner.query(`DROP TABLE "favorite_item"`);
        await queryRunner.query(`DROP TABLE "user_favorite"`);
        await queryRunner.query(`DROP TABLE "user_profile"`);
    }

}
