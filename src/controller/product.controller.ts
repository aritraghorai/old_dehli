import { Zone } from '@/entities/address.entity.js';
import { Category } from '@/entities/category.entity.js';
import {
  OptionValue,
  Product,
  ProductCofiguration,
  ProductItem,
  ProductType,
  Shop,
} from '@/entities/product.entity.js';
import { TimeSlot } from '@/entities/timeslot.entity.js';
import AppError from '@/utils/AppError.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import {
  NewProductBody,
  NewProductItem,
  ProductQuery,
  UpdateProductItemBody,
  UpdateProductRequestBody,
} from '@/validator/product.validator.js';
import { NextFunction, Request, Response } from 'express';
import { In, Like, MoreThan } from 'typeorm';

const getAllProduct = catchAsync(
  async (
    req: Request<{}, {}, {}, ProductQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const { limit, page, category, search, shop } = req.query;
    const [products, total] = await Product.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: [
        {
          slug: search ? Like(`%${search}%`) : Like(`%%`),
          category: {
            slug: category ? Like(`%${category}%`) : Like(`%%`),
          },
          shop: {
            slug: shop ? Like(`%${shop}%`) : Like(`%%`),
            isActive: true,
          },
          productItems: MoreThan(0),
          isActive: true,
        },
      ],
      order: {
        priority: 'DESC',
      },
      relations: {
        category: true,
        shop: true,
        productItems: true,
        type: true,
        timeSlot: true,
        allowZones: true,
      },
    });
    res.status(200).json({
      status: true,
      data: products,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    });
  },
);

const getAllProductAdmin = catchAsync(
  async (
    req: Request<{}, {}, {}, ProductQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const products = await Product.find({
      relations: {
        category: true,
        shop: true,
        productItems: true,
        type: true,
        timeSlot: true,
        allowZones: true,
      },
      order: {
        priority: 'DESC',
      },
    });
    res.status(200).json({
      status: true,
      data: products,
    });
  },
);

const getProductById = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
      },
      relations: {
        productTag: true,
        productItems: {
          productConfig: {
            option: true,
            optionValue: {
              option: true,
            },
          },
        },
        category: true,
      },
    });
    res.status(200).json({
      status: true,
      data: product,
    });
  },
);

const createProduct = catchAsync(
  async (req: Request<any, any, NewProductBody>, res: Response) => {
    const {
      name,
      price,
      productTags = [],
      shopId,
      categoryId,
      description,
      productType,
      timeSlot,
      minOrderQuantity,
      allowZones,
    } = req.body;
    const slug = name.toLowerCase().split(' ').join('-');
    await myDataSource.transaction(async tx => {
      const productTypeExist = await ProductType.findOne({
        where: {
          id: productType,
        },
      });
      if (!productTypeExist) {
        throw new AppError('Product type not found', 404);
      }

      const timeSlotExist = await TimeSlot.findOne({
        where: {
          id: timeSlot,
        },
      });

      if (!timeSlotExist) {
        throw new AppError('Time slot not found', 404);
      }

      const product = Product.create({
        name,
        price,
        slug,
        description,
        category: {
          id: categoryId,
        },
        shop: {
          id: shopId,
        },
        productTag: productTags.map((tag: string) => ({
          id: tag,
        })),
        type: productTypeExist,
        timeSlot: timeSlotExist,
        minOrderQuantity,
      });

      if (!!allowZones) {
        const zones = await Zone.find({
          where: {
            id: In(allowZones),
          },
        });
        product.allowZones = zones;
      }

      await tx.save(product);
      res.status(201).json({
        status: true,
        data: product,
      });
    });
  },
);
//add new product item
const addNewProductItem = catchAsync(
  async (req: Request<{ id: string }, any, NewProductItem>, res: Response) => {
    const { id } = req.params;
    const {
      price,
      sku,
      stock,
      images = [],
      optionValues = [],
      weight,
    } = req.body;
    await myDataSource.transaction(async tx => {
      const prpductRepo = tx.getRepository(Product);
      const product = await prpductRepo.findOneById(id);
      if (!product) {
        res.status(404).json({
          status: false,
          message: 'Product not found',
        });
      }
      //check if product item with sku already exist
      const productItemRepo = tx.getRepository(ProductItem);
      const newProductItem = productItemRepo.create({
        price,
        sku,
        stock,
        weight,
        images: images?.map((image: string) => ({ id: image })),
        product: {
          id,
        },
      });
      await tx.save(newProductItem);
      //create product configuration
      const productConfigRepo = tx.getRepository(ProductCofiguration);
      const optionValueRepo = tx.getRepository(OptionValue);

      for (const optionValue of optionValues) {
        const getOptionValue = await optionValueRepo.findOne({
          where: {
            id: optionValue,
          },
          relations: {
            option: true,
          },
        });
        const productConfig = productConfigRepo.create({
          productItem: {
            id: newProductItem.id,
          },
          optionValue: {
            id: optionValue,
          },
          option: {
            id: getOptionValue.option.id,
          },
        });
        await tx.save(productConfig);
      }
      return res.status(201).json({
        status: true,
        message: 'Product item created',
        data: newProductItem,
      });
    });
  },
);

//Update product Item
const updateProductItem = catchAsync(
  async (
    req: Request<{ id: string }, any, UpdateProductItemBody>,
    res: Response,
  ) => {
    const { id } = req.params;
    const { sku, stock, price, optionValues = [], weight } = req.body;
    const productItem = await ProductItem.findOne({
      where: {
        id,
      },
      relations: {
        productConfig: {
          option: true,
          optionValue: true,
        },
      },
    });
    if (!productItem) {
      throw new AppError('Product item not found', 404);
    }
    productItem.sku = sku;
    productItem.stock = stock;
    productItem.price = price;
    productItem.weight = weight || productItem.weight;
    //check if option value exist or not
    for (const optionValue of optionValues) {
      //check option value exist or not
      const optionValueExist = productItem.productConfig.find(
        a => a.optionValue.id === optionValue,
      );
      if (optionValueExist) {
        continue;
      }
      //create new product configuration
      //find option value
      const findOptionValue = await OptionValue.findOne({
        where: {
          id: optionValue,
        },
        relations: {
          option: true,
        },
      });
      if (!findOptionValue) {
        throw new AppError('Option value not found', 404);
      }
      const productConfig = ProductCofiguration.create({
        productItem: {
          id: id,
        },
        optionValue: {
          id: optionValue,
        },
        option: {
          id: findOptionValue.option.id,
        },
      });
      await productConfig.save();
      productItem.productConfig.push(productConfig);
    }
    //delete option value
    for (const productConfig of productItem.productConfig) {
      if (!optionValues.some(op => productConfig.optionValue.id === op)) {
        await productConfig.remove();
      }
    }
    await productItem.save();
    res.status(200).json({
      status: true,
      message: 'Product item updated',
      data: productItem,
    });
  },
);

const updateProduct = catchAsync(
  async (
    req: Request<{ id: string }, any, UpdateProductRequestBody>,
    res: Response,
  ) => {
    const { id } = req.params;
    const {
      name,
      description,
      slug,
      price,
      isActive,
      categoryId,
      productType,
      timeSlot,
      minOrderQuantity,
      shopId,
      priority,
      allowZones,
    } = req.body;
    const product = await Product.findOneById(id);
    if (!product) {
      res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }
    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (slug) {
      product.slug = slug;
    }
    if (price) {
      product.price = price;
    }
    if (categoryId) {
      const category = await Category.findOneById(categoryId);
      if (!category) {
        res.status(404).json({
          status: false,
          message: 'Category not found',
        });
      }
      product.category = category;
    }
    if (productType) {
      const type = await ProductType.findOne({
        where: {
          id: productType,
        },
      });
      if (!type) {
        throw new AppError('Product type not found', 404);
      }
      product.type = type;
    }
    if (timeSlot) {
      const slot = await TimeSlot.findOne({
        where: {
          id: timeSlot,
        },
      });
      if (!slot) {
        throw new AppError('Time slot not found', 404);
      }
      product.timeSlot = slot;
    }
    if (minOrderQuantity) {
      product.minOrderQuantity = minOrderQuantity;
    }
    if (shopId) {
      const shop = await Shop.findOne({
        where: {
          id: shopId,
        },
      });
      if (!shop) {
        throw new AppError('Shop not found', 404);
      }
      product.shop = shop;
    }
    if (priority) {
      product.priority = priority;
    }
    if (isActive !== undefined) product.isActive = isActive;
    if (!!allowZones) {
      const zones = await Zone.find({
        where: {
          id: In(allowZones),
        },
      });
      product.allowZones = zones;
    }

    await product.save();
    res.status(200).json({
      status: true,
      message: 'Product updated',
      data: product,
    });
  },
);

export default {
  getAllProduct,
  getProductById,
  createProduct,
  addNewProductItem,
  getAllProductAdmin,
  updateProduct,
  updateProductItem,
};
