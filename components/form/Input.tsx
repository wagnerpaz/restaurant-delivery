import classNames from "classnames";

const Input = ({ className, ...props }) => {
  return (
    <input
      className={classNames(
        "ps-4 pe-4 py-2 rounded-md focus:outline-hero",
        className
      )}
      {...props}
    />
  );
};

export default Input;
