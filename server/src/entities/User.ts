import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  createdAt?: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Field()
  @Property({ type: "text" })
  password!: string;
}