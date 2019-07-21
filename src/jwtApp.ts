import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userService } from "./lib/services";

export const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  const auth = req.headers.authorization || "";

  // NEVER save personal information in a jwt
  const header = Buffer.from(auth.split(".")[0], "base64").toString();
  const body = Buffer.from(auth.split(".")[1], "base64").toString();
  console.log("This is just base64 encoded: ", header, body);
  console.log('--------------------------');

  // the jwt will only tell you if the data inside the jwt has changed since we made it
  const jwtData = jwt.verify(auth, "secret") as {userId: string};
  const user = userService.getUserById(jwtData.userId);
  if(!user) return res.status(401).end("Token has no associated user");

  res.end("If you can see this you have a valid jwt session");
});

app.post("/login", (req: Request, res: Response) => {
  const {username, password} = req.body;
  const user = userService.getUser(username, password);

  if(user) {
    const token = jwt.sign({userId: user.id}, "secret", {expiresIn: 3600});
    res.setHeader("authorization", token);
    return res.end(token);
  } else {
    return res.status(400).end("Username or password invalid");
  }
});
