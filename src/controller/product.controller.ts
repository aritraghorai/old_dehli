import {
  OptionValue,
  Product,
  ProductCofiguration,
  ProductItem,
} from '@/entities/product.entity.js';
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
import { Like, MoreThan } from 'typeorm';

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
      where: {
        name: search ? Like(`%${search}%`) : Like(`%%`),
        description: search ? Like(`%${search}%`) : Like(`%%`),
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
      relations: {
        category: true,
        shop: true,
        productItems: true,
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
    const { limit, page, category, search, shop } = req.query;
    const [products, total] = await Product.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: search ? Like(`%${search}%`) : Like(`%%`),
        description: search ? Like(`%${search}%`) : Like(`%%`),
        category: {
          slug: category ? Like(`%${category}%`) : Like(`%%`),
        },
        shop: {
          slug: shop ? Like(`%${shop}%`) : Like(`%%`),
        },
      },
      relations: {
        category: true,
        shop: true,
        productItems: true,
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
    } = req.body;
    const slug = name.toLowerCase().split(' ').join('-');
    await myDataSource.transaction(async tx => {
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
      });
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
    const { price, sku, stock, images = [], optionValues = [] } = req.body;
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
    const { sku, stock, price, optionValues = [] } = req.body;
    const productItem = await ProductItem.findOneById(id);
    if (!productItem) {
      throw new AppError('Product item not found', 404);
    }
    productItem.sku = sku;
    productItem.stock = stock;
    productItem.price = price;
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
      const findOptionValue = await OptionValue.findOneById(optionValue);
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
    }
    //delete option value
    for (const productConfig of productItem.productConfig) {
      if (!optionValues.includes(productConfig.optionValue.id)) {
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
    const { name, description, slug, price, isActive } = req.body;
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
    if (isActive !== undefined) product.isActive = isActive;
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
