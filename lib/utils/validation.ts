/**
 * Form validation utilities for Paint Calculator
 */

export interface FieldValidationRule {
  fieldKey: string;
  fieldName: string;
  value: string | number | undefined | null;
  required?: boolean;
  min?: number;
  domId?: string;
}

export type ValidationErrors = Record<string, string>;

/**
 * Validate a list of fields in the order they appear
 */
export function validateFields(rules: FieldValidationRule[]): {
  isValid: boolean;
  errors: ValidationErrors;
  firstErrorId?: string;
} {
  const errors: ValidationErrors = {};
  let firstErrorId: string | undefined = undefined;

  for (const rule of rules) {
    const rawVal = rule.value;
    const strVal = rawVal !== undefined && rawVal !== null ? String(rawVal).trim() : "";

    if (rule.required) {
      if (strVal === "") {
        errors[rule.fieldKey] = `Please enter ${rule.fieldName.toLowerCase()}`;
        if (!firstErrorId) {
          firstErrorId = rule.domId || rule.fieldKey;
        }
        continue;
      }
    }

    if (strVal !== "") {
      const num = Number(strVal);
      if (isNaN(num)) {
        errors[rule.fieldKey] = `Please enter a valid ${rule.fieldName.toLowerCase()}`;
        if (!firstErrorId) {
          firstErrorId = rule.domId || rule.fieldKey;
        }
        continue;
      }

      const minVal = rule.min !== undefined ? rule.min : 0;
      if (num <= minVal) {
        errors[rule.fieldKey] = `${rule.fieldName} must be greater than 0`;
        if (!firstErrorId) {
          firstErrorId = rule.domId || rule.fieldKey;
        }
        continue;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstErrorId,
  };
}

/**
 * Focus and smoothly scroll to the first invalid field
 */
export function focusFirstInvalidField(domId?: string): void {
  if (!domId || typeof document === "undefined") return;

  const element = document.getElementById(domId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      element.focus();
    }, 200);
  }
}
