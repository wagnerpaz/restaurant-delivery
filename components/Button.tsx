import { ComponentProps } from "react";
import classNames from "classnames";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "contained" | "outlined" | "text";
}

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant = "contained",
  ...props
}) => {
  return (
    <button
      className={classNames(
        "uppercase px-6 py-4 rounded-2xl text-sm font-bold text-light-high shadow-md bg-dark-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
