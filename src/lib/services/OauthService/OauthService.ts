
import { AccessTokenHolder } from "./AccessToken";
import { Profile } from "../UserService/User";

const tokenHolder = {
  accessToken: "token",
  ttlInSeconds: 3600,
  scope: "profile",
  userId: "1",
  createdAt: Date.now()
};

const validationCode = "code";
const codeDb = {};

export class OauthServie {
  createValidationCode(userId: string) {
    //@ts-ignore
    codeDb[validationCode] = userId;
    return validationCode;
  }

  isValidCode(code: string, userId: string) {
    //@ts-ignore
    const storedId = codeDb[code];
    const isValidCode = storedId === userId;

    if(isValidCode) return true;
    throw new Error("Invalid code");
  }

  createAccessTokenHolder() {
    return tokenHolder;
  }

  getAccessTokenHolder(_: string) {
    return tokenHolder;
  }

  getTokenHolderByAccessToken(accessToken: string): AccessTokenHolder | null {
    if (accessToken === "random value") {
      return tokenHolder;
    } else {
      return null;
    }
  }

  getProfile(accessTokenHolder: AccessTokenHolder): Profile | null {
    const expires = accessTokenHolder.createdAt + 3_600_000;
    if (accessTokenHolder.scope === "profile" && Date.now() > expires) {
      return { username: "user1" };
    } else {
      return null;
    }
  }
}
