import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Address } from "./address";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  birthDate!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;

  @OneToMany(() => Address, (address) => address.user, { nullable: true })
  addresses!: Address[];
}
