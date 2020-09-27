import { isString } from '../../../utils';

import { createStatus } from './utils';

const NO_ERRORS_VALUES = [false, undefined, null];

const defaultValidators = {
  required({ value, config }) {
    const message = isString(config) ? config : config?.message ?? '';
    const valid = value !== '';

    return !valid ? message : false;
  },
  pattern({ value, config }) {
    const message = config?.message ?? '';

    return !value.match(config.value) ? message : false;
  },
  minLength({ value, config }) {
    const message = config?.message ?? '';

    return value.length < config.value ? message : false;
  },
  maxLength({ value, config }) {
    const message = config?.message ?? '';

    return value.length > config.value ? message : false;
  },
  validate({ value, config }) {
    return config.validator(value);
  },
};

const withStatus = (validator) => ({
  config,
  eventType,
  onFinish,
  onStart,
  rule,
  value,
}) => async (prevStatus) => {
  const shouldSkip = config?.skip?.({ value, eventType });

  if (shouldSkip) {
    return prevStatus;
  }

  const message = await validator({ value, config, onFinish, onStart });
  const valid = NO_ERRORS_VALUES.includes(message);

  return createStatus({
    message,
    rule,
    terminate: !valid,
    valid,
    value,
  });
};

const composeValidators = (validators = defaultValidators) => ({
  eventType,
  onFinish,
  onStart,
  rules,
  value,
}) => {
  const mergedValidators = { ...defaultValidators, ...validators };

  return Object.keys(rules).reduce((acc, rule) => {
    const validator = mergedValidators[rule];
    const withStatusValidator = withStatus(validator)({
      config: rules[rule],
      eventType,
      onFinish,
      onStart,
      rule,
      value,
    });

    return validator ? [...acc, withStatusValidator] : acc;
  }, []);
};

export default composeValidators;
