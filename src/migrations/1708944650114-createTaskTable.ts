import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTaskTable1708944650114 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE task (
        id INT NOT NULL AUTO_INCREMENT,
        id_user INT NOT NULL,
        title varchar(255),
        description varchar(255),
        link varchar(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        CONSTRAINT primary_task_id PRIMARY KEY (id),
        CONSTRAINT foreign_user_id FOREIGN KEY (id_user) REFERENCES user(id)
      );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE task;
    `);
  }
}
