import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserPassword1705572902614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE user
        ADD COLUMN password varchar(255);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE user
        DROP COLUMN password;
    `);
  }
}
