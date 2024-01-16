import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE user (
        id INT NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        CONSTRAINT primary_user_id PRIMARY KEY (id),
        CONSTRAINT unique_user_email UNIQUE KEY (email)
       );`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        DROP TABLE user;
    `);
  }
}
