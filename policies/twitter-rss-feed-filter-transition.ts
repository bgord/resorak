export class TwitterRssFeedFilterTransition {
  static fails(from: boolean, to: boolean): boolean {
    return from === to;
  }
}
