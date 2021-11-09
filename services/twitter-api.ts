import axios from "axios";
import { z } from "zod";

import { Env } from "../env";

import * as VO from "../value-objects";

type ShowUserResponse = {
  id: VO.TwitterUserType["twitterUserId"];
  screen_name: VO.TwitterUserType["twitterUserName"];
  description: VO.TwitterUserType["twitterUserDescription"];
  profile_image_url_https: VO.TwitterUserType["twitterUserThumbnail"];
};

type GetTweetsResponse = {
  statuses: {
    id_str: string;
    created_at: string;
    text: string;
    in_reply_to_status_id: number | null;
  }[];
};

export class TwitterApi {
  private static config = {
    headers: {
      Authorization: `Bearer ${Env.TWITTER_API_BEARER_TOKEN}`,
    },
  };

  static async getUser(
    twitterUserName: VO.TwitterUserNameType
  ): Promise<VO.TwitterUserType | null> {
    try {
      const response = await axios.get<ShowUserResponse>(
        `https://api.twitter.com/1.1/users/show.json?screen_name=${twitterUserName}`,
        TwitterApi.config
      );

      return VO.TwitterUser.parse({
        twitterUserId: response.data.id,
        twitterUserName: response.data.screen_name,
        twitterUserDescription: response.data.description,
        twitterUserThumbnail: response.data.profile_image_url_https,
      });
    } catch (error) {
      return null;
    }
  }

  static async getTweetsFromUser(
    twitterUserName: VO.TwitterUserNameType
  ): Promise<VO.TweetType[]> {
    try {
      const response = await axios.get<GetTweetsResponse>(
        `https://api.twitter.com/1.1/search/tweets.json?q=${decodeURIComponent(
          `from:${twitterUserName}`
        )}`,
        TwitterApi.config
      );

      return z.array(VO.Tweet).parse(
        response.data.statuses.map((status) => ({
          id: status.id_str,
          createdAt: status.created_at,
          text: status.text,
          isReplyTweet: status.in_reply_to_status_id !== null,
        }))
      );
    } catch (error) {
      return [];
    }
  }
}
