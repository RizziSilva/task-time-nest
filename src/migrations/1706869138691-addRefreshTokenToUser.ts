import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRefreshTokenToUser1706869138691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE user
        ADD COLUMN refresh_token VARCHAR(255)
        AFTER password;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE user
        DROP COLUMN refresh_token;
    `);
  }
}
