import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1705405740072 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE user;
    `);
  }
}
