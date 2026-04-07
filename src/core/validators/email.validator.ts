import type { ValidatorFn } from "./validator.type.ts";

export const emailValidator: ValidatorFn = (input: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
};
