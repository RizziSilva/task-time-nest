import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyRefreshTokenSize1707300832722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE user
        MODIFY refresh_token varchar(1000)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE user
        MODIFY refresh_token varchar(255)
    `);
  }
}
