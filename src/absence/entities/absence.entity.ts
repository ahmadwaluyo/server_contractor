import { Project } from "src/projects/entities/project.entity";
import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'absence' })
export class Absence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' }) // Recommended
  clock_in: Date;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: false })
  request_overtime: boolean;

  @Column({ default: 0 })
  overtime: number;

  @Column({ default: "" })
  lat: string;

  @Column({ default: "" })
  long: string;

  @ManyToOne(() => User, user => user.absence)
  @JoinColumn({ name: 'userId' })
  public karyawan: User;

  @ManyToOne(() => Project, project => project.absences)
  @JoinColumn({ name: 'projectId' })
  public project: Project;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}
