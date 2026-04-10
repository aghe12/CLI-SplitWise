import type { ValidatorFn } from "./validator.type.js";

export const phoneValidator: ValidatorFn = (phoneNo) => {
  const phone = phoneNo.trim();
  
  if (!phone) {
    return "Phone number cannot be empty";
  }
  
  if (!/^\d+$/.test(phone)) {
    return "Phone number can only contain digits (0-9)";
  }
  
  if (phone.length < 10) {
    return `Phone number must be exactly 10 digits. You entered ${phone.length} digits.`;
  }
  
  if (phone.length > 10) {
    return `Phone number cannot be more than 10 digits. You entered ${phone.length} digits.`;
  }
  
  return true;
};
