import { TwitterUserType } from "../value-objects/twitter-user";

export class TwitterHandleExistsPolicy {
  static async fails(user: TwitterUserType | null): Promise<boolean> {
    return user !== null;
  }
}
