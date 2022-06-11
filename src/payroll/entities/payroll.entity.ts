import { Project } from "src/projects/entities/project.entity";
import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'payrol' })
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.payroll)
  @JoinColumn({ name: 'userId' })
  public employee: User;

  @Column({ default: 0, nullable: false })
  salary: number;

  @Column()
  descriptions: string;

  @ManyToMany(() => Project)
  @JoinTable()
  public projects: Project[]

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}
