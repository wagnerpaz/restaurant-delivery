import classNames from "classnames";

const Button = ({
  className,
  children,
  variant = "contained",
  size = "md",
  isDisabled = false,
  ...props
}) => {
  return (
    <button
      className={classNames(
        "flex flex-row gap-2 items-center justify-center",
        {
          "px-6 py-3 rounded-xl": size === "md",
          "px-2 py-3 rounded-md": size === "sm",
          "bg-hero text-hero-a11y-high uppercase font-bold":
            variant === "contained",
          "border border-hero": variant === "outline",
          "!px-0": "text",
          "opacity-50 cursor-not-allowed": isDisabled,
        },
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
