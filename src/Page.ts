export class Page {
  constructor(
    public readonly title: string,
    public readonly props: Record<string, any> = {},
  ) {}
}
