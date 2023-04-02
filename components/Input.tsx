import { ComponentProps } from "react";
import classNames from "classnames";
import { FaSearch } from "react-icons/fa";

interface InputProps extends ComponentProps<"input"> {
  containerClassName?: string;
  controlClassName?: string;
  variant?: "search";
  label?: string;
}

const Input: React.FC<InputProps> = ({
  className,
  containerClassName,
  controlClassName,
  children,
  variant,
  label,
  ...props
}) => {
  return (
    <div className={classNames("text-light-high", containerClassName)}>
      {label && (
        <label className="inline-block ml-2 font-bold mb-1">{label}</label>
      )}
      <div
        className={classNames(
          "flex flex-row items-center gap-2 bg-dark-200 rounded-md px-4 py-1 border-dark-400 border-[1px]",
          controlClassName
        )}
      >
        {variant === "search" && <FaSearch size={18} />}
        <input
          {...props}
          className={classNames(
            "bg-[transparent] outline-none w-full",
            className
          )}
        >
          {children}
        </input>
      </div>
    </div>
  );
};

Input.displayName = "Input";

export default Input;
