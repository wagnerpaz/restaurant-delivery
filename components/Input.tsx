import { ComponentProps } from "react";
import classNames from "classnames";
import { FaSearch } from "react-icons/fa";

interface InputProps extends ComponentProps<"input"> {}

const Input: React.FC<InputProps> = ({ className, children, ...props }) => {
  return (
    <div className="flex flex-row items-center gap-2 bg-dark-200 rounded-full px-4 py-1">
      <FaSearch size={18} />
      <input {...props} className={classNames("bg-[transparent]", className)}>
        {children}
      </input>
    </div>
  );
};

Input.displayName = "Input";

export default Input;
