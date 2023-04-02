import { ComponentProps } from "react";
import classNames from "classnames";

interface FieldsetProps extends ComponentProps<"fieldset"> {
  title?: string;
}

const Fieldset: React.FC<FieldsetProps> = ({
  className,
  children,
  title,
  ...props
}) => {
  return (
    <fieldset
      className={classNames(
        "p-4 border-[1px] border-dark-400 rounded-md text-light-high",
        className
      )}
      {...props}
    >
      {title && <legend className="text-sm">{title}</legend>}
      {children}
    </fieldset>
  );
};

export default Fieldset;
