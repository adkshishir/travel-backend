import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Newsletter')
export class Newsletter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
