export interface Validator {
  validate: (date: any) => Promise<ValidatorResult>;
}

export type ValidatorResult = {
  sanitizedData: any;
  error?: Error;
};
