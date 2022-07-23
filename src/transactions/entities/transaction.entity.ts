import { Project } from "src/projects/entities/project.entity";
import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  debit: number;

  @Column({ default: 0 })
  credit: number;

  @Column()
  category: 'material' | 'konsumsi' | 'transportasi' | 'project_fee' | 'cashbond' | 'lainnya';

  @Column()
  descriptions: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: false })
  isRejected: boolean;

  @Column({ default: false })
  isPayed: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  transaction_update: Date;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  transaction_date: Date;

  @ManyToOne(() => Project, project => project.transactions)
  @JoinColumn({ name: 'projectId' })
  public project: Project;

  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'userId' })
  public applicant: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}
