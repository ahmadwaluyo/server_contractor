import { Absence } from "src/absence/entities/absence.entity";
import { Payroll } from "src/payroll/entities/payroll.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  project_name: string;

  @Column()
  owner_name: string;

  @Column()
  project_address: string;

  @Column({ nullable: false })
  saldo_project: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  start_date: Date;

  @Column({ nullable: false })
  end_date: Date;

  @Column({ default: 0 })
  progress: number;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => User, (user: User) => user.project)
	public workers: User[]

  @OneToMany(() => Absence, (abs: Absence) => abs.project)
	public absences: Absence[]

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.project)
	public transactions: Transaction[]

  @ManyToMany(() => Payroll)
  @JoinTable()
  public payrolls: Payroll[]

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;

}
