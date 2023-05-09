import classNames from "classnames";

const Input = ({ className, isDisabled, ...props }) => {
  return (
    <input
      className={classNames(
        "ps-4 pe-4 py-2 rounded-md focus:outline-hero border border-main-a11y-low w-full",
        { "bg-main-200 cursor-not-allowed": isDisabled },
        className
      )}
      disabled={isDisabled}
      {...props}
    />
  );
};

export default Input;
