import classNames from "classnames";

const Input = ({ className, isDisabled, ...props }) => {
  return (
    <input
      className={classNames(
        "ps-4 pe-4 py-2 -mt-[7px] bg-[transparent] rounded-md border-none w-full outline-none appearance-none",
        { "cursor-not-allowed": isDisabled },
        className
      )}
      disabled={isDisabled}
      {...props}
    />
  );
};

export default Input;
