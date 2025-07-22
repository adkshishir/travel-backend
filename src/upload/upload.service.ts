import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { CreateUploadDto } from './dto/create-upload.dto';
import responseHelper from 'src/utils/response-helper';

@Injectable()
export class UploadService {
  private baseUploadDir = path.join(__dirname, '../../uploads');
  private baseUrl = 'https://api-poonhill.adhikarishishir.com.np'; // Update this as needed

  constructor(private prisma: PrismaService) {
    if (!fs.existsSync(this.baseUploadDir)) {
      fs.mkdirSync(this.baseUploadDir, { recursive: true });
    }
  }

  async processAndSave({ file, folder, alt }: CreateUploadDto): Promise<any> {
    if (!file) {
      throw new BadRequestException(
        responseHelper.error('No file uploaded.'),
      );
    }

    const safeFolder = folder || 'images';
    const folderPath = path.join(this.baseUploadDir, safeFolder);

    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const fileExtension = path.extname(file.originalname);
      const baseFileName = path
        .basename(file.originalname, fileExtension)
        .replace(/\s+/g, '-')
        .toLowerCase();

      const webpFileName = `${baseFileName}.webp`;

      // File paths
      const originalPath = path.join(folderPath, webpFileName);
      const cardPath = path.join(folderPath, `card-${webpFileName}`);
      const phonePath = path.join(folderPath, `phone-${webpFileName}`);

      // Check for existing file in DB
      const existingMedia = await this.prisma.media.findFirst({
        where: {
          original: `${this.baseUrl}/uploads/${safeFolder}/${webpFileName}`,
        },
      });

      if (fs.existsSync(originalPath) && existingMedia) {
        return existingMedia;
      }

      // Save images in different sizes
      await sharp(file.buffer).toFormat('webp').toFile(originalPath);
      await sharp(file.buffer)
        .resize(300, 200)
        .toFormat('webp', { quality: 60 })
        .toFile(cardPath);
      await sharp(file.buffer)
        .resize(600)
        .toFormat('webp', { quality: 50 })
        .toFile(phonePath);

      const media = await this.prisma.media.create({
        data: {
          original: `${this.baseUrl}/uploads/${safeFolder}/${webpFileName}`,
          thumbnail: `${this.baseUrl}/uploads/${safeFolder}/card-${webpFileName}`,
          phone: `${this.baseUrl}/uploads/${safeFolder}/phone-${webpFileName}`,
          type: 'image',
          alt,
        },
      });

      return media;
    } catch (error) {
      console.error('Upload Error:', error);
      throw new InternalServerErrorException(
        responseHelper.error('Failed to process and save the image.', error.message),
      );
    }
  }

  async deleteFile(id: number) {
    try {
      const media = await this.prisma.media.findUnique({ where: { id } });

      if (!media) throw new NotFoundException(responseHelper.error('File not found'));

      // const filesToDelete = [media.original, media.thumbnail, media.phone];

      // for (const fileUrl of filesToDelete) {
      //   try {
      //     if (fs.existsSync(fileUrl)) {
      //       fs.unlinkSync(fileUrl);
      //     }
      //   } catch (error) {
      //     throw new Error(`Failed to delete file: ${fileUrl}`);
      //   }
      // }

      await this.prisma.media.delete({ where: { id } });
      return responseHelper.success('File deleted successfully', media);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to delete file', error.message),
      );
    }
  }
  async findAll() {
    try {
      const files = await this.prisma.media.findMany();
      return responseHelper.success('All files', files);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve files', error.message),
      );
    }
  }
}
