import type { ValidatorFn } from "./validator.type.ts";

export const numberValidator: ValidatorFn = (input: string) => {
  const value = input.trim();
  
  if (!value) {
    return "Balance cannot be empty";
  }
  
  if (isNaN(+value)) {
    return "Balance must be a valid number";
  }
  
  return true;
};
