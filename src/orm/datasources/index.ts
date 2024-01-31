import { Category } from "@/entities/category.entity.js";
import { Image } from "@/entities/image.entity.js";
import { Product } from "@/entities/product.entity.js";
import { User } from "@/entities/user.entiry.js";
import { myDataSource } from "@/utils/app-data-source.js";

export const userRepository = myDataSource.getRepository(User)
export const categoryRepository = myDataSource.getRepository(Category)
export const ImageRepository = myDataSource.getRepository(Image)
export const ProductRepository = myDataSource.getRepository(Product)
