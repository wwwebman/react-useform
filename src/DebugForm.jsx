import React from 'react';
import PropTypes from 'prop-types';

const DebugForm = (props) => {
  return (
    <div
      style={{
        border: '1px #eee solid',
        fontSize: 11,
        margin: 5,
        padding: '8px 16px ',
      }}
    >
      <p>
        <strong>Form debug:</strong>
      </p>
      {Object.keys(props).map((field) => {
        return (
          <pre key={field}>
            {field}: {JSON.stringify(props[field], null, 2)}
          </pre>
        );
      })}
    </div>
  );
};

DebugForm.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  validating: PropTypes.object.isRequired,
};

export default DebugForm;
