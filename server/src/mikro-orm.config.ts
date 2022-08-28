import { Post } from "./entities/Post";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from './entities/User';

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
  entities: [Post,User],
  dbName: "lireddit",
  type: "postgresql",
  user: "postgres",
  password: "Webdevwithdiaby@2021",
  allowGlobalContext: true,
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
