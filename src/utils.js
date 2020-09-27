export const isObject = (obj) =>
  typeof obj === 'object' && obj !== null && !isArray(obj);

export const getValueFromEvent = (eventOrValue) => {
  if (isObject(eventOrValue) && 'target' in eventOrValue) {
    const { type, value, checked } = eventOrValue.target;

    return type === 'checkbox' ? checked : value;
  }

  return eventOrValue;
};

export const createStatus = ({
  message = undefined,
  rule = undefined,
  terminate = undefined,
  valid = undefined,
  value = undefined,
}) => ({
  message,
  rule,
  terminate,
  valid,
  value,
});

export const createError = (rule, message) => ({
  message,
  rule,
});

export const pipe = (...validators) => (initialStatus) =>
  validators.reduce(async (s, nextValidator) => {
    const status = await s;

    return status.terminate ? status : nextValidator(status);
  }, initialStatus);
