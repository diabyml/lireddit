import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

// for session, go back to odl playground
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { COOKIE_NAME, __prod__ } from "./constants";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user.resolver";

import { MyContext } from "./types";

// ioredis and connect redis setup
import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
let RedisStore = connectRedis(session);
const redisClient = new Redis();

// redis express-session
// import session from "express-session";
// import connectRedis from "connect-redis";
// let RedisStore = connectRedis(session);

// redis@v4
// import { createClient } from "redis";
// let redisClient = createClient({ legacyMode: true });
// redisClient.connect().catch(console.error);

// for preventing the issue below
// Property 'userId' does not exist on type 'Session & Partial<SessionData>'
import "express-session";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// rerun again

const main = async () => {
  // configure typeorm connection
  const conn = await createConnection({
    type: "postgres",
    database: "lireddit2",
    username: "postgres",
    password: "Webdevwithdiaby@2021",
    logging: true,
    synchronize: true, // prefered in development, that automatically runs the migartions
    entities: [User, Post],
    migrations: [path.join(__dirname, "./migrations/*")],
  });

  conn.runMigrations();

  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // Configure redis to manage our sessions
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
        // disableTTL: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years,
        httpOnly: true,
        secure: __prod__, // only https,
        sameSite: "lax", // csrf
      },
      saveUninitialized: false,
      secret: "my-secret-key",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis: redisClient,
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      }),
    ],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("Listening on port 4000");
  });
};

main().catch((err) => console.log(err));
