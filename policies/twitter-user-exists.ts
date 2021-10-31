import * as VO from "../value-objects";

export class TwitterUserExists {
  static async fails(twitterUser: VO.TwitterUserType | null): Promise<boolean> {
    return twitterUser === null;
  }
}
