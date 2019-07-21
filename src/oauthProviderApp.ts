import express, { Request, Response } from "express";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { userService, oauthService } from "./lib/services";
import path from "path";

const client = redis.createClient();
const redisStore = connectRedis(session);

client.on('error', (err: Error) => {
  console.log('Redis error: ', err);
});

export const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, "views")); 

app.use(session({
  secret: 'secret',
  name: 'my-oauth-provider-session',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new redisStore({ host: 'localhost', port: 6379, client, ttl: 3600 }),
}));

app.get("/validate", (req: Request, res: Response) => {
  if(req.session) {
    const user = userService.getUserById(req.session && req.session.userId);
    if(!user) return res.redirect("/login");
  } else {
    return res.redirect("/login");
  }

  res.render("consent.ejs", {validationCode: oauthService.createValidationCode(req.session.userId)});
});

app.post("/consent", (req: Request, res: Response) => {
  const {code} = req.body;

  oauthService.isValidCode(code, req.session && req.session.userId);
  const holder = oauthService.createAccessTokenHolder();

  res.redirect(`http://localhost:3002/token?token=${holder.accessToken}`);
});

app.get("/profile", (req: Request, res: Response) => {
  const holder = oauthService.getAccessTokenHolder(req.query.token);
  res.json(userService.getUserById(holder.userId));
});

app.get("/login", (_: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "views", "login.html"));
});

app.post("/login", (req: Request, res: Response) => {
  const {username, password} = req.body;
  const user = userService.getUser(username, password);

  if(user && req.session) {
    req.session.userId = user.id;
  } else {
    return res.status(400).end("Username or password invalid");
  }

  res.redirect("/validate");
});
