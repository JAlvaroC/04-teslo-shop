import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { DataSource, Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { PaginationDTO } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('Product Service');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    // @InjectRepository(ProductImage)
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      // NOTE: es recomentable ahcerlo antes de insertar con BeforeInsert()
      // if (!createProductDto.slug) {
      //   createProductDto.slug = createProductDto.title
      //   .toLowerCase()
      //   .replaceAll(" ",'_')
      //   .replaceAll("'",'')
      // }else{
      //   createProductDto.slug = createProductDto.slug
      //   .toLowerCase()
      //   .replaceAll(" ",'_')
      //   .replaceAll("'",'')
      // }
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
        user,
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      // console.log(error);
      this.handleExceptions(error);
    }
    // return 'This action adds a new product';
  }
  // TODO: paginar
  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // Todo: relaciones
      relations: {
        images: true,
      },
    });

    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map((img) => img.url),
    })); //aplanando con map
    // NOTE: PRIMERA FORMA
    // return products.map((product) => ({
    //   ...product,
    //   images: product.images.map((img) => img.url),
    // })); //aplanando con map
  }

  async findOne(term: string) {
    // return this.productRepository.find({});
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term });
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages') //para cargar las imagenes
        .getOne();
      //NOTE: Para minuscula es LOWER()

      // select *from Products where slug='XX or  title=xxx'
    }

    // const product = await this.productRepository.findOneBy({ term });
    // product =
    if (!product) {
      throw new NotFoundException(`Product with term ${term} not found`);
    }
    // return { ...product, images: product.images.map((image) => image.url) };
    return product;
    // return product;
    // return `This action returns a #${id} product`;
  }
  // Metodo para aplanar
  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
      // ...updateProductDto,
      // images: [],
    });
    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found `);

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner(); //avisa cuanto intentas un registro mismo nombre o dato
    // Una sertie de Query que puede inpactar la BD
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        // Cuando mandas imagen
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        // NOTE:CUidado con delete * from ProductImage
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }
      //  else {
      //   // Cuando no mandas imagen
      //   product.images = await this.productImageRepository.findBy({
      //     product: { id },
      //   });
      // }
      product.user = user;
      await queryRunner.manager.save(product);
      // await this.productRepository.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      // return product;
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction(); //revertira las acciones
      await queryRunner.release();

      this.handleExceptions(error);
    }
    // return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);

    // return;
    // return `This action removes a #${id} product`;
  }
  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadGatewayException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs !',
    );
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleExceptions(error);
    }
  }
}
