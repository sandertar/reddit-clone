import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [
    Post,
    User,
  ],
  dbName: "reddit",
  type: "postgresql",
  user: "postgres",
  password: "password",
  port: 5432,
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];