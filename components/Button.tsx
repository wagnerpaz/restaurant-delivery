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
        "uppercase text-sm font-bold text-light-high",
        {
          "px-6 py-4 rounded-2xl shadow-md bg-dark-300":
            variant === "contained",
        },
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
