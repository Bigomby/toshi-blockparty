export interface MessageDto {
  readonly sender: string;
  readonly content: {
    readonly body: string;
    readonly showKeyboard: boolean;
  };
}
