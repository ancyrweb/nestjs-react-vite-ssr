export class Page {
  constructor(
    public readonly componentName: string,
    public readonly props: Record<string, any> = {},
  ) {}
}
