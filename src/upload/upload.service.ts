import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { CreateUploadDto } from './dto/create-upload.dto';

@Injectable()
export class UploadService {
  private baseUploadDir = path.join(__dirname, '../../uploads');
  private baseUrl = 'http://localhost:8080'; // Replace with your actual base URL

  constructor(private prisma: PrismaService) {
    if (!fs.existsSync(this.baseUploadDir)) {
      fs.mkdirSync(this.baseUploadDir, { recursive: true });
    }
  }

  async processAndSave({ file, entity }: CreateUploadDto): Promise<any> {
    if (!file) {
      throw new Error('No file uploaded.');
    }

    // Create folder if not exists
    const entityDir = path.join(this.baseUploadDir, entity);
    if (!fs.existsSync(entityDir)) {
      fs.mkdirSync(entityDir, { recursive: true });
    }

    // Get filename (remove spaces & keep extension)
    const fileExtension = path.extname(file.originalname);
    const fileName =
      path
        .basename(file.originalname, fileExtension)
        .replace(/\s+/g, '-')
        .toLowerCase() + '.webp';

    // Paths
    const originalPath = path.join(entityDir, fileName);
    const cardPath = path.join(entityDir, `card-${fileName}`);
    const phonePath = path.join(entityDir, `phone-${fileName}`);

    // Check if file already exists
    if (fs.existsSync(originalPath)) {
      // If file exists, return its path without re-saving
      const existingMedia = await this.prisma.media.findFirst({
        where: { original: `/uploads/${entity}/${fileName}` },
      });

      if (existingMedia) {
        return existingMedia;
      }
    }

    // Save Image in Different Sizes
    await sharp(file.buffer).toFormat('webp').toFile(originalPath);
    await sharp(file.buffer)
      .resize(300, 200)
      .toFormat('webp', { quality: 60 })
      .toFile(cardPath);
    await sharp(file.buffer)
      .resize(600)
      .toFormat('webp', { quality: 50 })
      .toFile(phonePath);

    // Full URL paths
    const fullOriginalUrl = `${this.baseUrl}/uploads/${entity}/${fileName}`;
    const fullCardUrl = `${this.baseUrl}/uploads/${entity}/card-${fileName}`;
    const fullPhoneUrl = `${this.baseUrl}/uploads/${entity}/phone-${fileName}`;

    // Store in DB with full URLs
    const media = await this.prisma.media.create({
      data: {
        original: fullOriginalUrl,
        thumbnail: fullCardUrl,
        phone: fullPhoneUrl,
        type: 'image',
      },
    });

    return media;
  }

  async deleteFile(id: number) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });
    if (media) {
      // Delete the actual files
      fs.unlinkSync(
        path.join(this.baseUploadDir, media.original.replace(this.baseUrl, '')),
      );
      fs.unlinkSync(
        path.join(
          this.baseUploadDir,
          media.thumbnail.replace(this.baseUrl, ''),
        ),
      );
      fs.unlinkSync(
        path.join(this.baseUploadDir, media.phone.replace(this.baseUrl, '')),
      );

      // Delete the media record from DB
      await this.prisma.media.delete({ where: { id } });
    }
  }
}
