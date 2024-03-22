import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTaskTimeTable1709719097070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE taskTime (
            id INT NOT NULL AUTO_INCREMENT,
            id_task INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP,
            initiated_at TIMESTAMP NOT NULL,
            ended_at TIMESTAMP NOT NULL,
            time_spent MEDIUMINT UNSIGNED NOT NULL,
            CONSTRAINT primary_task_time_id PRIMARY KEY (id),
            CONSTRAINT foreign_task_id FOREIGN KEY(id_task) REFERENCES task(id) ON DELETE CASCADE
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE taskTime;
    `);
  }
}
