import { Absence } from "src/absence/entities/absence.entity";
import { Project } from "src/projects/entities/project.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone_number: string;

  @Column({ default: 0 })
  saldo: number;

  @Column({ default: 0 })
  salary: number;

  @ManyToOne(() => RoleEntity, roles => roles.users)
  @JoinColumn({ name: 'roleId' })
  public role: RoleEntity;

  @ManyToOne(() => Project, project => project.workers)
  @JoinColumn({ name: 'projectId' })
  public project: Project;

  @OneToMany(() => Absence, (absence: Absence) => absence.karyawan)
  public absence: Absence[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;

  @BeforeInsert()
	emailToLowerCase () {
    this.email = this.email.toLowerCase();
	}
}
