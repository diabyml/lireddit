import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";

// for session, go back to odl playground
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { COOKIE_NAME, __prod__ } from "./constants";
import config from "./mikro-orm.config";
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

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

const main = async () => {
  const orm = await MikroORM.init(config);
  // await orm.em.nativeDelete(User,{});
  await orm.getMigrator().up();

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
      em: orm.em,
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
