import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskTime } from './taskTime.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_user' })
  idUser: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  link: string;

  @Column({ name: 'created_at' })
  createdAt: string;

  @Column({ name: 'updated_at' })
  updatedAt: string;

  @OneToMany(() => TaskTime, (taskTime) => taskTime.task, {
    cascade: ['remove'],
  })
  times: TaskTime[] = [];
}
