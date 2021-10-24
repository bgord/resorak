import { TwitterHandleType } from "../value-objects/twitter-handle";

export class TwitterHandleExistsPolicy {
  static async fails(_twitterHandle: TwitterHandleType): Promise<boolean> {
    return true;
  }
}
