import { MigrationInterface, QueryRunner } from "typeorm";

export class Add21706643497228 implements MigrationInterface {
    name = 'Add21706643497228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "isVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying, "password" character varying, "isVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "otp" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "path" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" text, "parentId" uuid, "imageId" uuid, CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_487e83eff1f3c9d987018390a23" UNIQUE ("slug"), CONSTRAINT "PK_1439455c6528caa94fcc8564fda" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6256ce64831184b7311bfd7757d" UNIQUE ("value"), CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "option_value" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "optionId" uuid, CONSTRAINT "UQ_489f2d087b47aff8d3e31b6aaaa" UNIQUE ("value"), CONSTRAINT "PK_c7313aaad3e41027533fb46a5bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_cofiguration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "optionId" uuid, "optionValueId" uuid, CONSTRAINT "PK_92502a71129ebc1eb38704a8a35" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."product_status_enum" AS ENUM('published', 'draft')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "status" "public"."product_status_enum" NOT NULL DEFAULT 'published', "description" text, "price" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE ("slug"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying NOT NULL, "stock" numeric NOT NULL, "price" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid, "productConfigId" uuid, CONSTRAINT "UQ_054be2476e9f1c534fcf3b476bf" UNIQUE ("sku"), CONSTRAINT "UQ_e23f7aaad56b6baf547910b6bfa" UNIQUE ("productId", "productConfigId"), CONSTRAINT "PK_83c3b7a80f6fe1d5ad7fa05a2a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_role_role" ("userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_8f1a6e129f057889ccddcb4b533" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_26736dfb41d6a47ce5d8365aad" ON "user_role_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8188039e9fdf7572245e2ed8a8" ON "user_role_role" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "product_productTag" ("productId" uuid NOT NULL, "productTagId" uuid NOT NULL, CONSTRAINT "PK_4c1071d09ec9ea3b616b1d3024a" PRIMARY KEY ("productId", "productTagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_11621b28cde3831865a69a9db1" ON "product_productTag" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_051e41ccc16970de25d4372f8e" ON "product_productTag" ("productTagId") `);
        await queryRunner.query(`CREATE TABLE "productItem_image" ("productItemId" uuid NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "PK_22d18ec835bccc0b42c4a65f98a" PRIMARY KEY ("productItemId", "imageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ca84851e4db4fdd2711fd13559" ON "productItem_image" ("productItemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac303313f171637a6a3b2bb7a8" ON "productItem_image" ("imageId") `);
        await queryRunner.query(`CREATE TABLE "category_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_8da8666fc72217687e9b4f4c7e9" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4aa1348fc4b7da9bef0fae8ff4" ON "category_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a22002acac4976977b1efd114" ON "category_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_db724db1bc3d94ad5ba38518433" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_8a12e4cb68bc526f8d8e59efb12" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "option_value" ADD CONSTRAINT "FK_2d7616b884ef55e6eb5af000f1d" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "FK_31c66c798f0280b478199cfb01b" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "FK_5ff24a8e00e36ecaf8668e4c098" FOREIGN KEY ("optionValueId") REFERENCES "option_value"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_item" ADD CONSTRAINT "FK_5be351f01d190ba6c78adc013a9" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_item" ADD CONSTRAINT "FK_a2b8baaf8a535217af0e215bc31" FOREIGN KEY ("productConfigId") REFERENCES "product_cofiguration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role_role" ADD CONSTRAINT "FK_26736dfb41d6a47ce5d8365aad7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_role_role" ADD CONSTRAINT "FK_8188039e9fdf7572245e2ed8a83" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_productTag" ADD CONSTRAINT "FK_11621b28cde3831865a69a9db15" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_productTag" ADD CONSTRAINT "FK_051e41ccc16970de25d4372f8e6" FOREIGN KEY ("productTagId") REFERENCES "product_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "productItem_image" ADD CONSTRAINT "FK_ca84851e4db4fdd2711fd135592" FOREIGN KEY ("productItemId") REFERENCES "product_item"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "productItem_image" ADD CONSTRAINT "FK_ac303313f171637a6a3b2bb7a82" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_closure" ADD CONSTRAINT "FK_4aa1348fc4b7da9bef0fae8ff48" FOREIGN KEY ("id_ancestor") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_closure" ADD CONSTRAINT "FK_6a22002acac4976977b1efd114a" FOREIGN KEY ("id_descendant") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_closure" DROP CONSTRAINT "FK_6a22002acac4976977b1efd114a"`);
        await queryRunner.query(`ALTER TABLE "category_closure" DROP CONSTRAINT "FK_4aa1348fc4b7da9bef0fae8ff48"`);
        await queryRunner.query(`ALTER TABLE "productItem_image" DROP CONSTRAINT "FK_ac303313f171637a6a3b2bb7a82"`);
        await queryRunner.query(`ALTER TABLE "productItem_image" DROP CONSTRAINT "FK_ca84851e4db4fdd2711fd135592"`);
        await queryRunner.query(`ALTER TABLE "product_productTag" DROP CONSTRAINT "FK_051e41ccc16970de25d4372f8e6"`);
        await queryRunner.query(`ALTER TABLE "product_productTag" DROP CONSTRAINT "FK_11621b28cde3831865a69a9db15"`);
        await queryRunner.query(`ALTER TABLE "user_role_role" DROP CONSTRAINT "FK_8188039e9fdf7572245e2ed8a83"`);
        await queryRunner.query(`ALTER TABLE "user_role_role" DROP CONSTRAINT "FK_26736dfb41d6a47ce5d8365aad7"`);
        await queryRunner.query(`ALTER TABLE "product_item" DROP CONSTRAINT "FK_a2b8baaf8a535217af0e215bc31"`);
        await queryRunner.query(`ALTER TABLE "product_item" DROP CONSTRAINT "FK_5be351f01d190ba6c78adc013a9"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "FK_5ff24a8e00e36ecaf8668e4c098"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "FK_31c66c798f0280b478199cfb01b"`);
        await queryRunner.query(`ALTER TABLE "option_value" DROP CONSTRAINT "FK_2d7616b884ef55e6eb5af000f1d"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_8a12e4cb68bc526f8d8e59efb12"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_db724db1bc3d94ad5ba38518433"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a22002acac4976977b1efd114"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4aa1348fc4b7da9bef0fae8ff4"`);
        await queryRunner.query(`DROP TABLE "category_closure"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac303313f171637a6a3b2bb7a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca84851e4db4fdd2711fd13559"`);
        await queryRunner.query(`DROP TABLE "productItem_image"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_051e41ccc16970de25d4372f8e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11621b28cde3831865a69a9db1"`);
        await queryRunner.query(`DROP TABLE "product_productTag"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8188039e9fdf7572245e2ed8a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26736dfb41d6a47ce5d8365aad"`);
        await queryRunner.query(`DROP TABLE "user_role_role"`);
        await queryRunner.query(`DROP TABLE "product_item"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
        await queryRunner.query(`DROP TABLE "product_cofiguration"`);
        await queryRunner.query(`DROP TABLE "option_value"`);
        await queryRunner.query(`DROP TABLE "option"`);
        await queryRunner.query(`DROP TABLE "product_tag"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
