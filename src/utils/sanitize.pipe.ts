import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizePipe implements PipeTransform {
  private readonly allowedFields = [
    'content',
    'description',
    'overview',
    'itinerary',
    'includes',
    'goodtoknow',
    'highlights',
    'embedVideo',
  ];

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' || typeof value !== 'object' || !value) {
      return value;
    }

    return this.sanitizeObject(value);
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const sanitized = { ...obj };
    for (const key of Object.keys(sanitized)) {
      if (typeof sanitized[key] === 'string') {
        if (this.allowedFields.includes(key)) {
          // Allow safe HTML for rich text fields
          sanitized[key] = sanitizeHtml(sanitized[key], {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
              'img',
              'figure',
              'figcaption',
              'iframe',
              'video',
              'source',
            ]),
            allowedAttributes: {
              ...sanitizeHtml.defaults.allowedAttributes,
              img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
              iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
              video: ['src', 'width', 'height', 'controls'],
              source: ['src', 'type'],
              '*': ['class', 'id', 'style'],
            },
            allowedSchemes: ['http', 'https', 'mailto'],
          });
        } else {
          // Strip all HTML for plain text fields
          sanitized[key] = sanitizeHtml(sanitized[key], {
            allowedTags: [],
            allowedAttributes: {},
          });
        }
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null && !Array.isArray(sanitized[key])) {
        sanitized[key] = this.sanitizeObject(sanitized[key]);
      }
    }
    return sanitized;
  }
}
