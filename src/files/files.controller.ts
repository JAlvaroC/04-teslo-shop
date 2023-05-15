import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files - Get and Upload ')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
    // res.status(403).json({
    //   ok: false,
    //   path: path,
    // });
    // return path;
    // return imageName;
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits:{fileSize:1000},
      storage: diskStorage({
        // Cambiamos la ruta
        destination: './static/products',
        // destination: './static/uploads',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    console.log({ fileInController: file });
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    console.log(file);
    // const secureUrl = `${file.filename}`;
    // const secureUrl = `http://localhost:3001/api/files/product/07cf1635-f14b-45fd-95d5-f0ca436fba74.png`;
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${
      file.filename
    }`;
    return {
      secureUrl,
    };
    // return {
    //   fileName: file.originalname,
    // };
    // return file;
  }
}
