import axios from "axios";

import { Env } from "../env";

import { TwitterUser, TwitterUserType } from "../value-objects/twitter-user";
import { TwitterHandleType } from "../value-objects/twitter-handle";

type ShowTwitterUserResponse = {
  id: TwitterUserType["twitterUserId"];
  screen_name: TwitterUserType["twitterUserName"];
};

export class TwitterService {
  private static config = {
    headers: {
      Authorization: `Bearer ${Env.TWITTER_BEARER_TOKEN}`,
    },
  };

  static async showUser(
    twitterHandle: TwitterHandleType
  ): Promise<TwitterUserType | null> {
    try {
      const response = await axios.get<ShowTwitterUserResponse>(
        `https://api.twitter.com/1.1/users/show.json?screen_name=${twitterHandle}`,
        TwitterService.config
      );

      return TwitterUser.parse({
        twitterUserId: response.data.id,
        twitterUserName: response.data.screen_name,
      });
    } catch (error) {
      return null;
    }
  }
}
