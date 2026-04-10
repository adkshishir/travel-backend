import { Activity } from './activity.entity';
import { Author } from './author.entity';
import { Blog } from './blog.entity';
import { Booking } from './booking.entity';
import { Carousel } from './carousel.entity';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { Destination } from './destination.entity';
import { Faq } from './faq.entity';
import { Mail } from './mail.entity';
import { Media } from './media.entity';
import { Newsletter } from './newsletter.entity';
import { Package } from './package.entity';
import { Payment } from './payment.entity';
import { Review } from './review.entity';
import { Seo } from './seo.entity';
import { SiteInformation } from './site-information.entity';
import { Team } from './team.entity';
import { User } from './user.entity';
import { Wishlist } from './wishlist.entity';

export const ALL_ENTITIES = [
  SiteInformation,
  Media,
  Seo,
  User,
  Carousel,
  Author,
  Activity,
  Destination,
  Package,
  Blog,
  Review,
  Faq,
  Booking,
  Payment,
  Team,
  Mail,
  Comment,
  Wishlist,
  Category,
  Newsletter,
];

export * from './user-role.enum';
export * from './site-information.entity';
export * from './media.entity';
export * from './seo.entity';
export * from './user.entity';
export * from './carousel.entity';
export * from './author.entity';
export * from './activity.entity';
export * from './destination.entity';
export * from './package.entity';
export * from './blog.entity';
export * from './review.entity';
export * from './faq.entity';
export * from './booking.entity';
export * from './payment.entity';
export * from './team.entity';
export * from './mail.entity';
export * from './comment.entity';
export * from './wishlist.entity';
export * from './category.entity';
export * from './newsletter.entity';
