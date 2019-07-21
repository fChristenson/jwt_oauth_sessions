import express, { Request, Response } from "express";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { userService } from "./lib/services";
import axios from "axios";

const client = redis.createClient();
const redisStore = connectRedis(session);

client.on('error', (err: Error) => {
  console.log('Redis error: ', err);
});

export const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
  secret: 'secret',
  name: 'my-session',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new redisStore({ host: 'localhost', port: 6379, client, ttl: 3600 }),
}));

app.get("/", (req: Request, res: Response) => {
  if(req.session) {
    const user = userService.getUserById(req.session && req.session.userId);
    if(!user) return res.redirect("http://localhost:3003/validate");
  } else {
    return res.redirect("http://localhost:3003/validate");
  }

  res.end("If you can see this you have a valid oauth session");
});

app.get("/token", async (req: Request, res: Response) => {
  const tokenRes = await axios.get(`http://localhost:3003/profile?token=${req.query.token}`);
  const user = userService.createUser(tokenRes.data.username);
  if(req.session) {
    req.session.userId = user.id;
  }
  res.redirect("/");
});
