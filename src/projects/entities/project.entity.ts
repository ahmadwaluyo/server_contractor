import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @OneToMany(() => User, (user: User) => user.project)
	public workers: User[]

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;

}
