import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  email!: string;

  @Column()
  birthDate!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;
}
