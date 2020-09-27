import { useState, useRef } from 'react';

import allowOnlyHandlers from './allowOnly';
import composeValidators from './validators';
import { createError, createStatus, getValueFromEvent, pipe } from './utils';

const useForm = ({
  cacheErrors = true,
  constraintValidation = false,
  defaultValues = {},
  validateOn = ['submit'],
  validators = {},
}) => {
  const cachedErrors = useRef([]);
  const registeredFields = useRef([]);
  const fieldsRules = useRef({});
  const statuses = useRef({});
  const fieldsAllowOnly = useRef({});
  const [formState, setFormState] = useState({
    errors: {},
    values: defaultValues,
    validating: {},
    isSubmitting: false,
  });

  const setValues = (values) => {
    setFormState((state) => ({
      ...state,
      values: {
        ...state.values,
        ...values,
      },
    }));
  };

  const setErrors = (errors) => {
    setFormState((state) => ({
      ...state,
      errors: {
        ...state.errors,
        ...errors,
      },
    }));
  };

  const removeErrors = (field) => {
    setFormState((state) => {
      const { [field]: _, ...errors } = state.errors;

      return {
        ...state,
        errors,
      };
    });
  };

  const setValidating = (field, validating) => {
    setFormState((state) => ({
      ...state,
      validating: {
        ...state.validating,
        [field]: validating,
      },
    }));
  };

  const toggleSubmitting = () => {
    setFormState((state) => ({
      ...state,
      isSubmitting: !state.isSubmitting,
    }));
  };

  const register = (field, rules, allowOnly) => {
    if (!registeredFields.current.includes(field)) {
      registeredFields.current.push(field);
    }

    if (rules) {
      fieldsRules.current[field] = rules;

      statuses.current = {
        ...statuses.current,
        [field]: createStatus({}),
      };

      cachedErrors.current = {
        ...cachedErrors.current,
        [field]: {},
      };
    }

    if (allowOnly) {
      fieldsAllowOnly.current[field] = allowOnly;
    }
  };

  const unRegister = (field) => {
    registeredFields.current = registeredFields.current.filter(
      (f) => f !== field,
    );
    delete fieldsRules.current[field];
    delete fieldsAllowOnly.current[field];

    setErrors({
      [field]: '',
    });
  };

  const setCustomValidity = (e, message = '', reportValidity = false) => {
    if (!constraintValidation?.enable) {
      return;
    }

    if (e && e.target) {
      e.persist();
      e.target.setCustomValidity(message);
    }

    if (reportValidity) {
      constraintValidation.formRef.current.reportValidity();
    }
  };

  const validateField = async ({ rules = [], field, value, e, eventType }) => {
    const sameValue = statuses.current[field].value === value;
    const cached = cachedErrors.current[field][value];

    if (sameValue) {
      return false;
    }

    if (cacheErrors && cached) {
      setErrors({ [field]: createError(cached.rule, cached.message) });
      return false;
    }

    setValidating(field, true);

    const prevStatus = statuses.current[field];
    const initialStatus = { ...prevStatus, terminate: undefined };
    const status = await pipe(
      ...composeValidators(validators)({
        eventType,
        rules,
        value,
      }),
    )(initialStatus);
    const { rule, message, valid } = status;

    setValidating(field, false)
    statuses.current[field] = status;

    if (!valid) {
      setCustomValidity(e, message, true);
      setErrors({ [field]: createError(rule, message) });

      if (cacheErrors) {
        cachedErrors.current[field][value] = { rule, message };
      }

      return false;
    }

    return true;
  };

  const handleChange = (field, e) => {
    const value = getValueFromEvent(e);
    const rules = fieldsRules.current[field];
    const allowOnly = fieldsAllowOnly.current[field];
    const allowOnlyHandler = allowOnlyHandlers[allowOnly];
    const cleanedValue = allowOnlyHandler ? allowOnlyHandler(value) : value;

    setValues({ [field]: cleanedValue });
    setCustomValidity(e, '');
    removeErrors(field);

    if (rules && validateOn.includes('change')) {
      validateField({
        e,
        eventType: 'change',
        field,
        rules,
        value: cleanedValue,
      });
    }
  };

  const handleBlur = (field, e) => {
    const value = getValueFromEvent(e);
    const rules = fieldsRules.current[field];

    if (rules && validateOn.includes('blur')) {
      validateField({ rules, field, value, e, eventType: 'blur' });
    }
  };

  const runFormValidation = (cb) => {
    toggleSubmitting();

    const fieldsValidationResult = registeredFields.current.map((field) => {
      const rules = fieldsRules.current[field];
      const value = formState.values[field];

      if (formState.validating[field] && !rules) {
        return true;
      }

      return validateField({
        rules,
        field,
        value,
        eventType: 'submit',
      });
    });

    Promise.all(fieldsValidationResult).then((values) => {
      toggleSubmitting();

      if (cb) {
        cb({
          isValid: values.every((valid) => valid),
          values: formState.values,
        });
      }
    });
  };

  const handleSubmit = (cb) => (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (validateOn.includes('submit')) {
      runFormValidation(cb);
    }
  };

  const control = {
    handleBlur,
    handleChange,
    register,
    setErrors,
    setValues,
    unRegister,
    validateField,
  };

  return {
    control,
    errors: formState.errors,
    handleSubmit,
    isSubmitting: formState.isSubmitting,
    validating: formState.validating,
    values: formState.values,
    statuses: statuses.current,
  };
};

export default useForm;
