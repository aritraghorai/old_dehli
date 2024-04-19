import { Image } from '@/entities/image.entity.js';
import { myDataSource } from '@/utils/app-data-source.js';

await myDataSource.connect();

const image = myDataSource.getRepository(Image);

const images = await image.find();

images.forEach(async img => {
  img.url = img.url.replace(
    'http://localhost:3000',
    'https://iamag.duckdns.org',
  );
  await image.save(img);
});
