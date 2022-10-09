import cors from 'cors';
import express from 'express';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { User } from './db.js';

// @NOTE: modules to set up graphql
import { ApolloServer } from 'apollo-server-express'
import { readFile } from 'fs/promises';
import { resolvers } from './resolvers.js'

const PORT = 9000;
const JWT_SECRET = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(cors(), express.json(), expressjwt({
  algorithms: ['HS256'],
  credentialsRequired: false,
  secret: JWT_SECRET,
}));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne((user) => user.email === email);
  if (user && user.password === password) {
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

// @NOTE: gql setup
const typeDefs = await readFile('./schema.graphql', 'utf8'); // @NOTE: types in file
const apolloServer = new ApolloServer({ typeDefs, resolvers }) // @NOTE: init apollo
await apolloServer.start(); // @NOTE: start it (it is a promise)
apolloServer.applyMiddleware({app, path: '/graphql'}) // @NOTE: applyMiddleware

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
});
