import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import { UserResolver } from "./UserResolvers";
// import { ApolloLink } from "apollo-link";
// import {createConnection} from "typeorm";
// import {User} from "./entity/User";

(async () => {
  const app = express();

  app.get("/", (_req, res) => {
    res.send("Hello from root!");
  });

  await createConnection();

  console.log(process.env.ACCESS_TOKEN_SECRET);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server up and running on http://localhost:4000/ ");
    console.log(
      "GraphQL server up and running on http://localhost:4000/graphql"
    );
  });
})();

/*//createConnection().then(async connection => {*/

//console.log("Inserting a new user into the database...");
//const user = new User();
//user.firstName = "Timber";
//user.lastName = "Saw";
//user.age = 25;
//await connection.manager.save(user);
//console.log("Saved a new user with id: " + user.id);

//console.log("Loading users from the database...");
//const users = await connection.manager.find(User);
//console.log("Loaded users: ", users);

//console.log("Here you can setup and run express/koa/any other framework.");

/*}).catch(error => console.log(error));*/
