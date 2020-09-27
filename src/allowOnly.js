const allowOnlyHandlers = {
  numbers: (value) => value.replace(/[^0-9]/gi, ''),
};

export default allowOnlyHandlers;
