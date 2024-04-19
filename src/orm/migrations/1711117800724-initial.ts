import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1711117800724 implements MigrationInterface {
    name = 'Initial1711117800724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "time_slot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slot" character varying(255) NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0e1bd1e5eb1a5e57c1f5eeaf958" UNIQUE ("slot"), CONSTRAINT "PK_03f782f8c4af029253f6ad5bacf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "path" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" text, "parentId" uuid, "imageId" uuid, CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pincode" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pincode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_02873af513efadd5a20fa9331c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_offices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "circle" character varying NOT NULL, "district" character varying NOT NULL, "division" character varying NOT NULL, "region" character varying NOT NULL, "block" character varying NOT NULL, "state" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pincode_id" uuid, CONSTRAINT "PK_462d593b5575336748ab6da4cc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "zone" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "deliveryCharges" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bd3989e5a3c3fb5ed546dfaf832" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "mobile" character varying NOT NULL, "alternatePhone" character varying, "locality" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "landmark" character varying NOT NULL, "state" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pincode_id" uuid, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_487e83eff1f3c9d987018390a23" UNIQUE ("slug"), CONSTRAINT "PK_1439455c6528caa94fcc8564fda" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6256ce64831184b7311bfd7757d" UNIQUE ("value"), CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "option_value" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "optionId" uuid, CONSTRAINT "UQ_489f2d087b47aff8d3e31b6aaaa" UNIQUE ("value"), CONSTRAINT "PK_c7313aaad3e41027533fb46a5bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7bc84b5c963fa67c7a9668655c1" UNIQUE ("slug"), CONSTRAINT "UQ_f0640e30fef1d175426d80dbc13" UNIQUE ("name"), CONSTRAINT "PK_ad47b7c6121fe31cb4b05438e44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "imageId" uuid, CONSTRAINT "UQ_9ea6957ecb3677204c580411f7f" UNIQUE ("slug"), CONSTRAINT "PK_e0843930fbb8854fe36ca39dae1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."product_status_enum" AS ENUM('published', 'draft')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "status" "public"."product_status_enum" NOT NULL DEFAULT 'published', "description" text, "price" double precision NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "minOrderQuantity" numeric NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "shopId" uuid, "productTypeId" uuid, "timeSlotId" uuid, "categoryId" uuid, CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE ("slug"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying NOT NULL, "stock" numeric NOT NULL, "price" double precision NOT NULL, "weight" double precision NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid, CONSTRAINT "UQ_054be2476e9f1c534fcf3b476bf" UNIQUE ("sku"), CONSTRAINT "PK_83c3b7a80f6fe1d5ad7fa05a2a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_cofiguration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productItemId" uuid, "optionValueId" uuid, "optionId" uuid, CONSTRAINT "UQ_8652206850de57443dbd9b9bb0f" UNIQUE ("productItemId", "optionValueId", "optionId"), CONSTRAINT "PK_92502a71129ebc1eb38704a8a35" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "isVerified" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "bio" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "image_id" uuid, CONSTRAINT "REL_938b0dfbabed6deaa4a9a91e91" UNIQUE ("image_id"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying, "password" character varying, "isVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "profile_id" uuid, CONSTRAINT "REL_f44d0cd18cfd80b0fed7806c3b" UNIQUE ("profile_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "address_id" uuid, "user_id" uuid, CONSTRAINT "PK_302d96673413455481d5ff4022a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_f47da2f31dce6d741ab6c106f5" UNIQUE ("user_id"), CONSTRAINT "PK_c506b756aa0682057bf66bdb3d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_favorite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_1d722c57635dc707eca7cf15af" UNIQUE ("user_id"), CONSTRAINT "PK_e161413fbdd7d2592f727858739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "favorite_id" uuid, "product_id" uuid, CONSTRAINT "REL_3eee7ce905fad8746dfb39c505" UNIQUE ("product_id"), CONSTRAINT "PK_fa18c8a7e7b3aa288ebd18885d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cart_id" uuid, "product_id" uuid, CONSTRAINT "UQ_38adfe5eca85cb882f6dc0722cc" UNIQUE ("cart_id", "product_id"), CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "mobile" character varying NOT NULL, "alternatePhone" character varying, "locality" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "landmark" character varying NOT NULL, "state" character varying NOT NULL, "deliveryDate" date NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pincodeId" uuid, CONSTRAINT "PK_f07603e96b068aae820d4590270" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "billing_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "locality" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "landmark" character varying NOT NULL, "state" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pincodeId" uuid, CONSTRAINT "PK_2a9547c7062edcb3034a1fb9ebf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "razorpay_payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderId" character varying NOT NULL, "paymentId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3624d91a4e217dcbef7fddddf9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderNumber" character varying, "discount" double precision NOT NULL DEFAULT '0', "grandTotal" double precision NOT NULL, "status" character varying NOT NULL, "orderId" character varying, "paymentGateway" character varying NOT NULL, "paymentStatus" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "order_address_id" uuid, "billing_address_id" uuid, "razorpay_payment_id" uuid, CONSTRAINT "REL_4e9546e160d94997ebf123aa0a" UNIQUE ("order_address_id"), CONSTRAINT "REL_5568d3b9ce9f7abeeb37511ecf" UNIQUE ("billing_address_id"), CONSTRAINT "REL_c42fb6e5ec6fd97cf57e2680f2" UNIQUE ("razorpay_payment_id"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "price" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "order_id" uuid, "product_item_id" uuid, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "otp" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "zone_pincode" ("zoneId" uuid NOT NULL, "pincodeId" uuid NOT NULL, CONSTRAINT "PK_725e10b0de57b75f3bd38b5b310" PRIMARY KEY ("zoneId", "pincodeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5e30498748e10ad287a991c4dc" ON "zone_pincode" ("zoneId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a0a4b138bbc147dd4038ca33b" ON "zone_pincode" ("pincodeId") `);
        await queryRunner.query(`CREATE TABLE "zone_products_product" ("zoneId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_76db8f88da819bc4fb876147333" PRIMARY KEY ("zoneId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d59fc9fbe66468906ce70591ab" ON "zone_products_product" ("zoneId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e196c14a293bb828e255b05b3a" ON "zone_products_product" ("productId") `);
        await queryRunner.query(`CREATE TABLE "restruent_image" ("shopId" uuid NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "PK_ffa51bc773a971fb593394aaa61" PRIMARY KEY ("shopId", "imageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d32e4ea2c5ad2de92ce6671c5d" ON "restruent_image" ("shopId") `);
        await queryRunner.query(`CREATE INDEX "IDX_08cd8019a8b64692c8e58635b9" ON "restruent_image" ("imageId") `);
        await queryRunner.query(`CREATE TABLE "product_productTag" ("productId" uuid NOT NULL, "productTagId" uuid NOT NULL, CONSTRAINT "PK_4c1071d09ec9ea3b616b1d3024a" PRIMARY KEY ("productId", "productTagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_11621b28cde3831865a69a9db1" ON "product_productTag" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_051e41ccc16970de25d4372f8e" ON "product_productTag" ("productTagId") `);
        await queryRunner.query(`CREATE TABLE "productItem_image" ("productItemId" uuid NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "PK_22d18ec835bccc0b42c4a65f98a" PRIMARY KEY ("productItemId", "imageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ca84851e4db4fdd2711fd13559" ON "productItem_image" ("productItemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac303313f171637a6a3b2bb7a8" ON "productItem_image" ("imageId") `);
        await queryRunner.query(`CREATE TABLE "user_role_role" ("userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_8f1a6e129f057889ccddcb4b533" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_26736dfb41d6a47ce5d8365aad" ON "user_role_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8188039e9fdf7572245e2ed8a8" ON "user_role_role" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "category_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_8da8666fc72217687e9b4f4c7e9" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4aa1348fc4b7da9bef0fae8ff4" ON "category_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a22002acac4976977b1efd114" ON "category_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_8a12e4cb68bc526f8d8e59efb12" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_offices" ADD CONSTRAINT "FK_9d20aaf06a83cd11eadb767c936" FOREIGN KEY ("pincode_id") REFERENCES "pincode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_761acb2f070e4a5a465d8b9f3d4" FOREIGN KEY ("pincode_id") REFERENCES "pincode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "option_value" ADD CONSTRAINT "FK_2d7616b884ef55e6eb5af000f1d" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_type" ADD CONSTRAINT "FK_cfb29ab706153ff6212e94ef7ec" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_1c4b1934c3e8c5b69b3d3d311d6" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98" FOREIGN KEY ("productTypeId") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_dc1c1c0ee885ec0b5cda129f529" FOREIGN KEY ("timeSlotId") REFERENCES "time_slot"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_item" ADD CONSTRAINT "FK_5be351f01d190ba6c78adc013a9" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "FK_5aa7494074e312d6c51b5db6b1b" FOREIGN KEY ("productItemId") REFERENCES "product_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "FK_5ff24a8e00e36ecaf8668e4c098" FOREIGN KEY ("optionValueId") REFERENCES "option_value"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" ADD CONSTRAINT "FK_31c66c798f0280b478199cfb01b" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "FK_938b0dfbabed6deaa4a9a91e919" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f44d0cd18cfd80b0fed7806c3b7" FOREIGN KEY ("profile_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_address" ADD CONSTRAINT "FK_b3bdd98c49956021c44c23a48c4" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_address" ADD CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_cart" ADD CONSTRAINT "FK_f47da2f31dce6d741ab6c106f55" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_favorite" ADD CONSTRAINT "FK_1d722c57635dc707eca7cf15af3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_item" ADD CONSTRAINT "FK_6d0231e4468108b7225921db8da" FOREIGN KEY ("favorite_id") REFERENCES "user_favorite"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_item" ADD CONSTRAINT "FK_3eee7ce905fad8746dfb39c505e" FOREIGN KEY ("product_id") REFERENCES "product_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_b6b2a4f1f533d89d218e70db941" FOREIGN KEY ("cart_id") REFERENCES "user_cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_67a2e8406e01ffa24ff9026944e" FOREIGN KEY ("product_id") REFERENCES "product_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_address" ADD CONSTRAINT "FK_dd69097ee596ff2f7c626d44203" FOREIGN KEY ("pincodeId") REFERENCES "pincode"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "billing_address" ADD CONSTRAINT "FK_11d1efcd452c3716d643a6311af" FOREIGN KEY ("pincodeId") REFERENCES "pincode"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_4e9546e160d94997ebf123aa0ae" FOREIGN KEY ("order_address_id") REFERENCES "order_address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_5568d3b9ce9f7abeeb37511ecf2" FOREIGN KEY ("billing_address_id") REFERENCES "billing_address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_c42fb6e5ec6fd97cf57e2680f2c" FOREIGN KEY ("razorpay_payment_id") REFERENCES "razorpay_payment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_6b6dd8c378acdda74832bf119a3" FOREIGN KEY ("product_item_id") REFERENCES "product_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_db724db1bc3d94ad5ba38518433" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "zone_pincode" ADD CONSTRAINT "FK_5e30498748e10ad287a991c4dc7" FOREIGN KEY ("zoneId") REFERENCES "zone"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "zone_pincode" ADD CONSTRAINT "FK_5a0a4b138bbc147dd4038ca33b4" FOREIGN KEY ("pincodeId") REFERENCES "pincode"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "zone_products_product" ADD CONSTRAINT "FK_d59fc9fbe66468906ce70591ab2" FOREIGN KEY ("zoneId") REFERENCES "zone"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "zone_products_product" ADD CONSTRAINT "FK_e196c14a293bb828e255b05b3a0" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restruent_image" ADD CONSTRAINT "FK_d32e4ea2c5ad2de92ce6671c5d7" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "restruent_image" ADD CONSTRAINT "FK_08cd8019a8b64692c8e58635b99" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_productTag" ADD CONSTRAINT "FK_11621b28cde3831865a69a9db15" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_productTag" ADD CONSTRAINT "FK_051e41ccc16970de25d4372f8e6" FOREIGN KEY ("productTagId") REFERENCES "product_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "productItem_image" ADD CONSTRAINT "FK_ca84851e4db4fdd2711fd135592" FOREIGN KEY ("productItemId") REFERENCES "product_item"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "productItem_image" ADD CONSTRAINT "FK_ac303313f171637a6a3b2bb7a82" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_role_role" ADD CONSTRAINT "FK_26736dfb41d6a47ce5d8365aad7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_role_role" ADD CONSTRAINT "FK_8188039e9fdf7572245e2ed8a83" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_closure" ADD CONSTRAINT "FK_4aa1348fc4b7da9bef0fae8ff48" FOREIGN KEY ("id_ancestor") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_closure" ADD CONSTRAINT "FK_6a22002acac4976977b1efd114a" FOREIGN KEY ("id_descendant") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_closure" DROP CONSTRAINT "FK_6a22002acac4976977b1efd114a"`);
        await queryRunner.query(`ALTER TABLE "category_closure" DROP CONSTRAINT "FK_4aa1348fc4b7da9bef0fae8ff48"`);
        await queryRunner.query(`ALTER TABLE "user_role_role" DROP CONSTRAINT "FK_8188039e9fdf7572245e2ed8a83"`);
        await queryRunner.query(`ALTER TABLE "user_role_role" DROP CONSTRAINT "FK_26736dfb41d6a47ce5d8365aad7"`);
        await queryRunner.query(`ALTER TABLE "productItem_image" DROP CONSTRAINT "FK_ac303313f171637a6a3b2bb7a82"`);
        await queryRunner.query(`ALTER TABLE "productItem_image" DROP CONSTRAINT "FK_ca84851e4db4fdd2711fd135592"`);
        await queryRunner.query(`ALTER TABLE "product_productTag" DROP CONSTRAINT "FK_051e41ccc16970de25d4372f8e6"`);
        await queryRunner.query(`ALTER TABLE "product_productTag" DROP CONSTRAINT "FK_11621b28cde3831865a69a9db15"`);
        await queryRunner.query(`ALTER TABLE "restruent_image" DROP CONSTRAINT "FK_08cd8019a8b64692c8e58635b99"`);
        await queryRunner.query(`ALTER TABLE "restruent_image" DROP CONSTRAINT "FK_d32e4ea2c5ad2de92ce6671c5d7"`);
        await queryRunner.query(`ALTER TABLE "zone_products_product" DROP CONSTRAINT "FK_e196c14a293bb828e255b05b3a0"`);
        await queryRunner.query(`ALTER TABLE "zone_products_product" DROP CONSTRAINT "FK_d59fc9fbe66468906ce70591ab2"`);
        await queryRunner.query(`ALTER TABLE "zone_pincode" DROP CONSTRAINT "FK_5a0a4b138bbc147dd4038ca33b4"`);
        await queryRunner.query(`ALTER TABLE "zone_pincode" DROP CONSTRAINT "FK_5e30498748e10ad287a991c4dc7"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_db724db1bc3d94ad5ba38518433"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_6b6dd8c378acdda74832bf119a3"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_c42fb6e5ec6fd97cf57e2680f2c"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_5568d3b9ce9f7abeeb37511ecf2"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_4e9546e160d94997ebf123aa0ae"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`);
        await queryRunner.query(`ALTER TABLE "billing_address" DROP CONSTRAINT "FK_11d1efcd452c3716d643a6311af"`);
        await queryRunner.query(`ALTER TABLE "order_address" DROP CONSTRAINT "FK_dd69097ee596ff2f7c626d44203"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_67a2e8406e01ffa24ff9026944e"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_b6b2a4f1f533d89d218e70db941"`);
        await queryRunner.query(`ALTER TABLE "favorite_item" DROP CONSTRAINT "FK_3eee7ce905fad8746dfb39c505e"`);
        await queryRunner.query(`ALTER TABLE "favorite_item" DROP CONSTRAINT "FK_6d0231e4468108b7225921db8da"`);
        await queryRunner.query(`ALTER TABLE "user_favorite" DROP CONSTRAINT "FK_1d722c57635dc707eca7cf15af3"`);
        await queryRunner.query(`ALTER TABLE "user_cart" DROP CONSTRAINT "FK_f47da2f31dce6d741ab6c106f55"`);
        await queryRunner.query(`ALTER TABLE "user_address" DROP CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53"`);
        await queryRunner.query(`ALTER TABLE "user_address" DROP CONSTRAINT "FK_b3bdd98c49956021c44c23a48c4"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f44d0cd18cfd80b0fed7806c3b7"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "FK_938b0dfbabed6deaa4a9a91e919"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "FK_31c66c798f0280b478199cfb01b"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "FK_5ff24a8e00e36ecaf8668e4c098"`);
        await queryRunner.query(`ALTER TABLE "product_cofiguration" DROP CONSTRAINT "FK_5aa7494074e312d6c51b5db6b1b"`);
        await queryRunner.query(`ALTER TABLE "product_item" DROP CONSTRAINT "FK_5be351f01d190ba6c78adc013a9"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_dc1c1c0ee885ec0b5cda129f529"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_1c4b1934c3e8c5b69b3d3d311d6"`);
        await queryRunner.query(`ALTER TABLE "product_type" DROP CONSTRAINT "FK_cfb29ab706153ff6212e94ef7ec"`);
        await queryRunner.query(`ALTER TABLE "option_value" DROP CONSTRAINT "FK_2d7616b884ef55e6eb5af000f1d"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_761acb2f070e4a5a465d8b9f3d4"`);
        await queryRunner.query(`ALTER TABLE "post_offices" DROP CONSTRAINT "FK_9d20aaf06a83cd11eadb767c936"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_8a12e4cb68bc526f8d8e59efb12"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a22002acac4976977b1efd114"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4aa1348fc4b7da9bef0fae8ff4"`);
        await queryRunner.query(`DROP TABLE "category_closure"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8188039e9fdf7572245e2ed8a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26736dfb41d6a47ce5d8365aad"`);
        await queryRunner.query(`DROP TABLE "user_role_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac303313f171637a6a3b2bb7a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca84851e4db4fdd2711fd13559"`);
        await queryRunner.query(`DROP TABLE "productItem_image"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_051e41ccc16970de25d4372f8e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11621b28cde3831865a69a9db1"`);
        await queryRunner.query(`DROP TABLE "product_productTag"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08cd8019a8b64692c8e58635b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d32e4ea2c5ad2de92ce6671c5d"`);
        await queryRunner.query(`DROP TABLE "restruent_image"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e196c14a293bb828e255b05b3a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d59fc9fbe66468906ce70591ab"`);
        await queryRunner.query(`DROP TABLE "zone_products_product"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a0a4b138bbc147dd4038ca33b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e30498748e10ad287a991c4dc"`);
        await queryRunner.query(`DROP TABLE "zone_pincode"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "razorpay_payment"`);
        await queryRunner.query(`DROP TABLE "billing_address"`);
        await queryRunner.query(`DROP TABLE "order_address"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`DROP TABLE "favorite_item"`);
        await queryRunner.query(`DROP TABLE "user_favorite"`);
        await queryRunner.query(`DROP TABLE "user_cart"`);
        await queryRunner.query(`DROP TABLE "user_address"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_profile"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "product_cofiguration"`);
        await queryRunner.query(`DROP TABLE "product_item"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
        await queryRunner.query(`DROP TABLE "product_type"`);
        await queryRunner.query(`DROP TABLE "shop"`);
        await queryRunner.query(`DROP TABLE "option_value"`);
        await queryRunner.query(`DROP TABLE "option"`);
        await queryRunner.query(`DROP TABLE "product_tag"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "zone"`);
        await queryRunner.query(`DROP TABLE "post_offices"`);
        await queryRunner.query(`DROP TABLE "pincode"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "time_slot"`);
    }

}
