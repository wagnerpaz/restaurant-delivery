import classNames from "classnames";
import { ReactNode } from "react";

interface FormControlProps {
  fieldsetClassName?: string;
  className?: string;
  children: ReactNode;
  label: string;
}

const FormControl: React.FC<FormControlProps> = ({
  fieldsetClassName,
  className,
  children,
  label,
}) => {
  return (
    <div className={classNames("relative -mt-2", className)}>
      <fieldset
        className={classNames(
          "border border-main-a11y-low rounded-md relative bg-main-100",
          fieldsetClassName
        )}
      >
        <legend className="ml-2 text-xs pt-0">{label}</legend>
        {children}
      </fieldset>
    </div>
  );
};

export default FormControl;
