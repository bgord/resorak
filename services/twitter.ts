import axios from "axios";

import { Env } from "../env";

import { TwitterUserType } from "../value-objects/twitter-user";
import { TwitterHandleType } from "../value-objects/twitter-handle";

type ResponseTwitterUserType = TwitterUserType & {
  screen_name: TwitterUserType["name"];
};

export class Twitter {
  static async showUser(twitterHandle: TwitterHandleType) {
    try {
      const response = await axios.get<ResponseTwitterUserType>(
        `https://api.twitter.com/1.1/users/show.json?screen_name=${twitterHandle}`,
        {
          headers: {
            Authorization: `Bearer ${Env.TWITTER_BEARER_TOKEN}`,
          },
        }
      );

      return { id: response.data.id, name: response.data.screen_name };
    } catch (error) {
      return null;
    }
  }
}
