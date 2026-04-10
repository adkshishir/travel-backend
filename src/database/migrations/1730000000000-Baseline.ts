import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Baseline migration — schema already applied via Prisma.
 * TypeORM tracks this so `migration:run` is safe on existing databases.
 */
export class Baseline1730000000000 implements MigrationInterface {
  name = 'Baseline1730000000000';

  public async up(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }
}
