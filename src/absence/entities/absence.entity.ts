import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'absence' })
export class Absence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' }) // Recommended
  clock_in: Date;

  @ManyToOne(() => User, user => user.absence)
  @JoinColumn({ name: 'userId' })
  public karyawan: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}
