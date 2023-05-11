import { memo } from "react";

import Input from "/components/form/Input";
import FormControl from "/components/FormControl";

interface MemoInputProps {
  label?: string;
  className: string;
  fieldsetClassName: string;
}

const MemoInput: React.FC<MemoInputProps> = ({
  fieldsetClassName,
  className,
  label,
  ...props
}) => {
  return (
    <FormControl
      fieldsetClassName={fieldsetClassName}
      className={className}
      label={label || ""}
    >
      <Input {...props} className="!min-w-0" />
    </FormControl>
  );
};

export default memo(
  MemoInput,
  (prevProps, nextProps) =>
    prevProps.value === nextProps.value &&
    prevProps.isDisabled === prevProps.isDisabled
);
