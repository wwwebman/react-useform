import React from 'react';

export type ValidateOn = 'submit' | 'change' | 'blur';

export interface SkipProps {
  on: ValidateOn;
  value: string;
}

export interface CommonRuleConfig {
  message?: string;
  preventValidationOn?: ValidateOn;
  skip?(props: SkipProps): boolean;
}

interface FieldErrors {
  message: string;
  rule: 'required' | 'pattern' | 'validate';
}

export type FieldsErrors<TValues> = {
  [K in keyof TValues]?: FieldErrors;
};

export type FieldsValidation<TValues> = {
  [K in keyof TValues]?: boolean;
};

export interface Rules {
  required?: CommonRuleConfig;
  pattern?: CommonRuleConfig & {
    regex: RegExp;
  };
  validate?: CommonRuleConfig & {
    validator(value: string): Promise<string | boolean> | string | boolean;
  };
}

export interface ValidateFieldProps {
  rules: Rules;
  field: string;
  value: string;
  e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>;
  on: ValidateOn;
}

export interface Control<TValues> {
  handleBlur(field: string, e: React.FocusEvent<HTMLInputElement>): void;
  handleChange(field: string, e: React.ChangeEvent<HTMLInputElement>): void;
  register(field: string, rules: Rules, allowOnly?: 'numbers'): void;
  setErrors(errors: { [K in keyof TValues]?: FieldErrors }): void;
  setValues(values: { [K in keyof TValues]?: string }): void;
  unRegister(field: string): void;
  validateField(props: ValidateFieldProps): boolean;
}

export interface useFormProps<TValues> {
  defaultValues: TValues;
  nativeValidation?: {
    enable: boolean;
    formRef: React.RefObject<HTMLFormElement>;
  };
  validateOn: ValidateOn[];
  showAllStaticErrors?: boolean;
}

export interface useFormApi<TValues> {
  control: Control<TValues>;
  errors: FieldsErrors<TValues>;
  handleSubmit(
    cb: (result: { isValid: true; values: TValues }) => void,
  ): (e: React.FormEvent) => void;
  isSubmitting: boolean;
  validating: FieldsValidation<TValues>;
  values: TValues;
}

export default function useForm<TValues = any>(
  props: useFormProps<TValues>,
): useFormApi<TValues>;
