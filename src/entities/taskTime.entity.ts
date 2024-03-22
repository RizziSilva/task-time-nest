import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity({ name: 'taskTime' })
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

  @Column({ name: 'time_spent' })
  timeSpent: number;

  @ManyToOne(() => Task, (task) => task.times, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_task' })
  task: Task;
}
