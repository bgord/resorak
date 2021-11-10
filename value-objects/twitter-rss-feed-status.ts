import { z } from "zod";

/* eslint-disable no-shadow */
export enum TwitterRssFeedStatusEnum {
  /* eslint-disable no-unused-vars */
  active = "active",
  suspended = "suspended",
}

export const TwitterRssFeedStatus = z
  .nativeEnum(TwitterRssFeedStatusEnum)
  .default(TwitterRssFeedStatusEnum.active);

export type TwitterRssFeedStatusType = z.infer<typeof TwitterRssFeedStatus>;
