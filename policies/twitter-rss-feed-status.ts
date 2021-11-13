import * as VO from "../value-objects";

export class TwitterRssFeedStatus {
  static fails(
    expected: VO.TwitterRssFeedStatusType,
    actual: VO.TwitterRssFeedStatusType
  ): boolean {
    return expected !== actual;
  }
}
