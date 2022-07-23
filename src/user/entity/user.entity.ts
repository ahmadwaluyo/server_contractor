import { Exclude } from "class-transformer";
import { Absence } from "src/absence/entities/absence.entity";
import { Payroll } from "src/payroll/entities/payroll.entity";
import { Project } from "src/projects/entities/project.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoleEntity } from "../../role/entities/role.entity";

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone_number: string;

  @Column({ default: 0 })
  saldo: number;

  @Column({ default: 0 })
  salary: number;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => RoleEntity, roles => roles.users)
  @JoinColumn({ name: 'roleId' })
  public role: RoleEntity;

  @ManyToMany(() => Project, project => project.workers, { cascade: true })
  @JoinTable()
  public projects: Project[];

  @OneToMany(() => Absence, (absence: Absence) => absence.karyawan)
  public absence: Absence[];

  @OneToMany(() => Payroll, (payrol: Payroll) => payrol.employee)
  public payroll: Payroll[];

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.applicant)
  public transactions: Transaction[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;

  @BeforeInsert()
	emailToLowerCase () {
    this.email = this.email.toLowerCase();
	}
}
