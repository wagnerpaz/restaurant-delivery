import classNames from "classnames";

const Input = ({ className, ...props }) => {
  return (
    <input
      className={classNames(
        "ps-4 pe-4 py-2 rounded-md focus:outline-hero border border-main-a11y-low w-full",
        className
      )}
      {...props}
    />
  );
};

export default Input;
