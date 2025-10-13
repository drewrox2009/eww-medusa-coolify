declare module "wrap-ansi" {
  type WrapAnsiOptions = {
    hard?: boolean;
    trim?: boolean;
    wordWrap?: boolean;
  };

  function wrapAnsi(
    input: string,
    columns: number,
    options?: WrapAnsiOptions
  ): string;

  export = wrapAnsi;
}
