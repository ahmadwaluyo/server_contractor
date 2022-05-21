import { User } from "src/user/entity/user.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  roleName: string;

  @OneToMany(() => User, (user: User) => user.role)
  public users: User[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;


  @BeforeInsert()
  roleNameToLowerCase() {
    this.roleName = this.roleName.toLowerCase();
  }
}