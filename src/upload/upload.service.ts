import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { CreateUploadDto } from './dto/create-upload.dto';
import responseHelper from 'src/utils/response-helper';
import { Media } from 'src/database/entities/media.entity';

@Injectable()
export class UploadService {
  private baseUploadDir = path.join(__dirname, '../../uploads');
  private baseUrl = 'https://api-poonhill.adhikarishishir.com.np';

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
  ) {
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

      const originalPath = path.join(folderPath, webpFileName);
      const cardPath = path.join(folderPath, `card-${webpFileName}`);
      const phonePath = path.join(folderPath, `phone-${webpFileName}`);

      const existingMedia = await this.mediaRepo.findOne({
        where: {
          original: `${this.baseUrl}/uploads/${safeFolder}/${webpFileName}`,
        },
      });

      if (fs.existsSync(originalPath) && existingMedia) {
        return existingMedia;
      }

      await sharp(file.buffer).toFormat('webp').toFile(originalPath);
      await sharp(file.buffer)
        .resize(300, 200)
        .toFormat('webp', { quality: 60 })
        .toFile(cardPath);
      await sharp(file.buffer)
        .resize(600)
        .toFormat('webp', { quality: 50 })
        .toFile(phonePath);

      const media = this.mediaRepo.create({
        original: `${this.baseUrl}/uploads/${safeFolder}/${webpFileName}`,
        thumbnail: `${this.baseUrl}/uploads/${safeFolder}/card-${webpFileName}`,
        phone: `${this.baseUrl}/uploads/${safeFolder}/phone-${webpFileName}`,
        type: 'image',
        alt,
      });
      await this.mediaRepo.save(media);

      return media;
    } catch (error) {
      console.error('Upload Error:', error);
      throw new InternalServerErrorException(
        responseHelper.error('Failed to process and save the image.', (error as Error).message),
      );
    }
  }

  async deleteFile(id: number) {
    try {
      const media = await this.mediaRepo.findOne({ where: { id } });

      if (!media) throw new NotFoundException(responseHelper.error('File not found'));

      await this.mediaRepo.remove(media);
      return responseHelper.success('File deleted successfully', media);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to delete file', (error as Error).message),
      );
    }
  }

  async findAll() {
    try {
      const files = await this.mediaRepo.find();
      return responseHelper.success('All files', files);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve files', (error as Error).message),
      );
    }
  }
}
