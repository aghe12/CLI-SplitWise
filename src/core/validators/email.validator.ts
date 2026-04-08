import type { ValidatorFn } from "./validator.type.ts";

export const emailValidator: ValidatorFn = (input: string) => {
  const email = input.trim();
  
  if (!email) {
    return "Email cannot be empty";
  }
  
  if (!email.includes('@')) {
    return "Email must contain '@' symbol";
  }
  
  if (!email.includes('.')) {
    return "Email must contain a domain (e.g., .com, .org)";
  }
  
  const parts = email.split('@');
  if (parts.length !== 2) {
    return "Email must have exactly one '@' symbol";
  }
  
  const [localPart, domain] = parts;
  if (!localPart) {
    return "Email must have text before '@' symbol";
  }
  
  if (!domain) {
    return "Email must have text after '@' symbol";
  }
  
  if (!domain.includes('.')) {
    return "Email domain must contain a dot (e.g., .com, .org)";
  }
  
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return "Email domain must have at least two parts (e.g., gmail.com)";
  }
  
  const lastDomainPart = domainParts[domainParts.length - 1];
  if (lastDomainPart && lastDomainPart.length < 2) {
    return "Email domain extension must be at least 2 characters (e.g., .com, .org)";
  }
  
  if (/[^a-zA-Z0-9@._-]/.test(email)) {
    return "Email contains invalid characters. Only letters, numbers, @, ., _, and - are allowed";
  }
  
  return true;
};
