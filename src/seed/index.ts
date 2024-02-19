import { Category } from '@/entities/category.entity.js';
import { Image } from '@/entities/image.entity.js';
import {
  Option,
  OptionValue,
  Product,
  ProductCofiguration,
  ProductItem,
  ProductTag,
  Shop,
} from '@/entities/product.entity.js';
import { myDataSource } from '@/utils/app-data-source.js';
import { faker } from '@faker-js/faker';

await myDataSource.initialize();

//clear all data
await myDataSource.getRepository(Image).delete({});
await myDataSource.getRepository(Category).delete({});
await myDataSource.getRepository(Product).delete({});
await myDataSource.getRepository(ProductTag).delete({});
await myDataSource.getRepository(Option).delete({});
await myDataSource.getRepository(OptionValue).delete({});
await myDataSource.getRepository(ProductCofiguration).delete({});
await myDataSource.getRepository(ProductItem).delete({});
await myDataSource.getRepository(Shop).delete({});
//add data

const images: Array<Image> = [];
const catagories: Array<Category> = [];
const products: Array<Product> = [];
const productTags: Array<ProductTag> = [];
const productOptions: Map<string, Array<OptionValue>> = new Map();
const productConfigurations: ProductCofiguration[] = [];
const shops: Array<Shop> = [];

await myDataSource.transaction(async manager => {
  //add images
  const imageRepository = manager.getRepository(Image);
  for (let i = 1; i <= 100; i++) {
    const newImage = imageRepository.create();
    newImage.url = faker.image.image();
    newImage.filename = faker.system.fileName();
    newImage.path = newImage.url;
    images.push(await newImage.save());
  }
  //add categories
  const categoryRepository = manager.getRepository(Category);
  const foodCatagories = [
    'Bakery',
    'Dairy',
    'Meat',
    'Seafood',
    'Produce',
    'Pantry',
    'Frozen',
    'Snacks',
    'Beverages',
    'Household',
    'Personal Care',
    'Baby',
    'Pets',
    'Home & Electronics',
    'Pharmacy',
    'International Foods',
    'Other',
  ];
  for (let i = 1; i <= foodCatagories.length; i++) {
    const newCategory = categoryRepository.create();
    newCategory.name = foodCatagories[i - 1];
    newCategory.slug = faker.helpers.slugify(newCategory.name);
    newCategory.description = faker.commerce.productDescription();
    if (i % 2 === 0) {
      newCategory.parent = catagories[i - 1];
    }
    newCategory.image = faker.helpers.arrayElement(images);
    catagories.push(await newCategory.save());
  }
  // add product tags
  const productTagRepository = manager.getRepository(ProductTag);
  const foodProductTags = [
    'Organic',
    'Gluten Free',
    'Vegan',
    'Vegetarian',
    'Kosher',
    'Halal',
    'Non-GMO',
  ];
  for (let i = 1; i <= foodProductTags.length; i++) {
    const newProductTag = productTagRepository.create();
    newProductTag.name = foodProductTags[i - 1];
    newProductTag.slug = faker.helpers.slugify(newProductTag.name);
    newProductTag.description = faker.commerce.productDescription();
    productTags.push(await newProductTag.save());
  }
  //add shops
  const shopRepository = manager.getRepository(Shop);
  for (let i = 1; i <= 100; i++) {
    const newShop = shopRepository.create();
    newShop.name = faker.company.name();
    newShop.slug = faker.helpers.slugify(newShop.name);
    newShop.description = faker.commerce.productDescription();
    newShop.images = [];
    newShop.images.push(faker.helpers.arrayElement(images));
    shops.push(await newShop.save());
  }
  //add products
  const productRepository = manager.getRepository(Product);
  for (let i = 1; i <= 100; i++) {
    const name = faker.commerce.productName();
    const newProduct = productRepository.create({
      name: faker.commerce.productName(),
      slug: faker.helpers.slugify(name) + faker.random.alphaNumeric(5),
      price: Math.floor(Math.random() * 1000000),
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(catagories),
      shop: faker.helpers.arrayElement(shops),
      productTag: [
        faker.helpers.arrayElement(productTags),
        faker.helpers.arrayElement(productTags),
      ],
    });
    products.push(await newProduct.save());
  }
  // add product option and product option value
  const productOptionRepository = manager.getRepository(Option);
  const productOptionValueRepository = manager.getRepository(OptionValue);
  const size = ['SMALL', 'MEDIUM', 'LARGE'];
  const option = productOptionRepository.create();
  option.value = 'Size';
  await option.save();
  productOptions.set(option.id, []);
  for (let i = 0; i < size.length; i++) {
    const optionValue = productOptionValueRepository.create();
    optionValue.value = size[i];
    optionValue.option = option;
    productOptions.get(option.id).push(await optionValue.save());
  }
  //add product configuration
  const productConfigurationRepository =
    manager.getRepository(ProductCofiguration);

  //add product item and configuration product item
  const productItemRepository = manager.getRepository(ProductItem);
  for (let i = 0; i < products.length; i++) {
    if (i % 2 === 0) {
      for (let j = 0; j < 3; j++) {
        let productItem = productItemRepository.create();
        productItem.product = products[i];
        productItem.stock = Math.floor(Math.random() * 100);
        productItem.price = Math.floor(Math.random() * 1000000);
        productItem.sku = faker.random.alphaNumeric(10);
        productItem.images = [];
        productItem.images.push(faker.helpers.arrayElement(images));
        await productItem.save();
        const productConfiguration = productConfigurationRepository.create();
        productConfiguration.productItem = productItem;
        productConfiguration.option = option;
        productConfiguration.optionValue = productOptions.get(option.id)[j];
        await productConfiguration.save()
      }
    } else {
      const productItem = productItemRepository.create();
      productItem.product = products[i];
      productItem.stock = Math.floor(Math.random() * 100);
      productItem.price = Math.floor(Math.random() * 1000000);
      productItem.sku = faker.random.alphaNumeric(10);
      productItem.images = [];
      productItem.images.push(faker.helpers.arrayElement(images));
      await productItem.save();
    }
  }
});

//add products
