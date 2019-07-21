import { app as sessionApp } from "./src/sessionApp";
import {app as jwtApp} from "./src/jwtApp";
import {app as oauthApp} from "./src/oauthApp";
import {app as oauthProviderApp} from "./src/oauthProviderApp";

sessionApp.listen(3000, () => {
  console.log("Running session app on port 3000");
  console.log('--------------------------');
});

jwtApp.listen(3001, () => {
  console.log("Running jwt app on port 3001");
  console.log('--------------------------');
});

oauthApp.listen(3002, () => {
  console.log("Running oauth app on port 3002");
  console.log('--------------------------');
});

oauthProviderApp.listen(3003, () => {
  console.log("Running oauth provider app on port 3003");
  console.log('--------------------------');
});
