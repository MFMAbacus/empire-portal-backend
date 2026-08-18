export type Service<Input, Output> = {
  execute: (input: Input) => Output;
};
