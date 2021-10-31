import * as VO from "../value-objects";

export class TwitterUserExists {
  static async fails(user: VO.TwitterUserType | null): Promise<boolean> {
    return user === null;
  }
}
