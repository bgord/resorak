import axios from "axios";
import { z } from "zod";

import { Env } from "../env";

import { TwitterUser, TwitterUserType } from "../value-objects/twitter-user";
import { Tweet, TweetType } from "../value-objects/tweet";
import { TwitterHandleType } from "../value-objects/twitter-handle";

type ShowUserResponse = {
  id: TwitterUserType["twitterUserId"];
  screen_name: TwitterUserType["twitterUserName"];
  description: TwitterUserType["twitterUserDescription"];
};

type GetTweetsResponse = {
  statuses: {
    id_str: string;
    created_at: string;
    text: string;
  }[];
};

export class TwitterApiService {
  private static config = {
    headers: {
      Authorization: `Bearer ${Env.TWITTER_API_BEARER_TOKEN}`,
    },
  };

  static async getUser(
    twitterHandle: TwitterHandleType
  ): Promise<TwitterUserType | null> {
    try {
      const response = await axios.get<ShowUserResponse>(
        `https://api.twitter.com/1.1/users/show.json?screen_name=${twitterHandle}`,
        TwitterApiService.config
      );

      return TwitterUser.parse({
        twitterUserId: response.data.id,
        twitterUserName: response.data.screen_name,
        twitterUserDescription: response.data.description,
      });
    } catch (error) {
      return null;
    }
  }

  static async getTweetsFromUser(
    twitterHandle: TwitterHandleType
  ): Promise<TweetType[]> {
    try {
      const response = await axios.get<GetTweetsResponse>(
        `https://api.twitter.com/1.1/search/tweets.json?q=${decodeURIComponent(
          `from:${twitterHandle}`
        )}`,
        TwitterApiService.config
      );

      return z.array(Tweet).parse(
        response.data.statuses.map((status) => ({
          id: status.id_str,
          createdAt: status.created_at,
          text: status.text,
        }))
      );
    } catch (error) {
      return [];
    }
  }
}
