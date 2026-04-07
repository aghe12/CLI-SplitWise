import type { ValidatorFn } from "./validator.type.js";

export const phoneValidator: ValidatorFn = (phoneNo) => {
  const phoneNoRegex = /^$|^\d{10}$/;
  return phoneNoRegex.test(phoneNo);
};
