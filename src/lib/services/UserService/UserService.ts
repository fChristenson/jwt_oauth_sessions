import {User} from "./User";

export class UserService {
  getUserById(id: string): User|null {
    if(id === "1") {
      return {id: "1", username: "foo", password: "bar"};
    } else {
      return null;
    }
  }

  getUser(username: string, password: string): User|null {
    if(username === "foo" && password === "bar") {
      return {id: "1", username, password};
    } else {
      return null;
    }
  }

  createUser(username: string): User {
    return {id: "1", username, password: "bar"};
  }
}
