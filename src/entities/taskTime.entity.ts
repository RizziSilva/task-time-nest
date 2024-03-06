import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'created_at' })
  createdAt: string;

  @Column({ name: 'updated_at' })
  updatedAt: string;

  @Column({ name: 'initiated_at' })
  initiatedAt: string;

  @Column({ name: 'ended_at' })
  endedAt: string;

  @Column({ name: 'id_task' })
  taskId: number;
}
