import { ReactNode } from "react";

interface FormControlProps {
  labelClassName?: string;
  className?: string;
  children: ReactNode;
  label: string;
}

const FormControl: React.FC<FormControlProps> = ({
  labelClassName,
  className,
  children,
  label,
}) => {
  return <div className={className}>{children}</div>;
};

export default FormControl;
