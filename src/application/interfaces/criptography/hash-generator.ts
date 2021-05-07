export interface HashGenerator {
  generate: (value: string) => Promise<string>;
}
