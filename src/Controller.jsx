import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * @visibleName Form Controller
 */
const Controller = ({ control, children, name, allowOnly, rules }) => {
  useEffect(() => {
    control.register(name, rules, allowOnly);

    return () => control.unRegister(name);
  }, []);

  return children({
    name,
    onBlur: (e) => {
      control.handleBlur(name, e);
    },
    onChange: (e) => {
      control.handleChange(name, e);
    },
  });
};

const commonRuleConfig = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  preventValidationOn: PropTypes.oneOf(['submit', 'change', 'blur']),
  skip: PropTypes.func,
};

Controller.propTypes = {
  /** Allows to protect fields from providing some characters. */
  allowOnly: PropTypes.oneOf(['numbers', undefined]),

  /**
   * Implements React Render Props pattern.
   * Children should be a function.
   */
  children: PropTypes.func.isRequired,

  /** Control methods required to establish connection with useForm(). */
  control: PropTypes.object.isRequired,

  /** Defines field name attribute. */
  name: PropTypes.string.isRequired,

  /** Validation rules. */
  rules: PropTypes.shape({
    required: PropTypes.oneOfType([
      PropTypes.shape(commonRuleConfig),
      PropTypes.string,
    ]),
    pattern: PropTypes.shape({
      ...commonRuleConfig,
      regex: PropTypes.instanceOf(RegExp),
    }),
    validate: PropTypes.shape({
      ...commonRuleConfig,
      validator: PropTypes.func.isRequired,
    }),
  }),
};

/** @component */
export default Controller;
