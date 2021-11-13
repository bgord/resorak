import * as VO from "../value-objects";

export class TwitterRssFeedStatusTransition {
  static fails(
    from: VO.TwitterRssFeedStatusType,
    to: VO.TwitterRssFeedStatusType
  ): boolean {
    const transitions: Record<
      VO.TwitterRssFeedStatusType,
      VO.TwitterRssFeedStatusType[]
    > = {
      [VO.TwitterRssFeedStatusEnum.active]: [
        VO.TwitterRssFeedStatusEnum.suspended,
      ],
      [VO.TwitterRssFeedStatusEnum.suspended]: [
        VO.TwitterRssFeedStatusEnum.active,
      ],
    };

    return !transitions[from].includes(to);
  }
}
