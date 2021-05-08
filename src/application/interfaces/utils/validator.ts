export interface Validator {
  validate: (date: any) => ValidatorResult;
}

export type ValidatorResult = {
  sanitizedData: any;
  error?: Error;
};
