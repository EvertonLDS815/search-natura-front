// Login.js

const Input = ({valueProps, setState, ...rest}) => {

  return (
    <input {...rest}
      value={valueProps}
      onChange={(e) => setState(e.target.value)}
      required
    />
  );
};

export default Input;