import { MikroORM } from "@mikro-orm/core";
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from "type-graphql";

import { __prod__ } from "./constants";
import dbConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const PORT = process.env.PORT || 4000;

const main = async () => {
  const orm = await MikroORM.init(dbConfig);
  await orm.getMigrator().up();
  const emFork = orm.em.fork();

  const app = express();
  const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/`);
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

  })
  
  await apolloServer.start();

  app.use(
    '/api/v1',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(apolloServer, {
      context: async () => ({ em: emFork }),
    }),
  );
}
main();
