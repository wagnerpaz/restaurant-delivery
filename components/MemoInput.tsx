import { memo } from "react";

import Input from "/components/form/Input";
import FormControl from "/components/FormControl";

interface LocalInputProps {
  label?: string;
  className: string;
}

const MemoInput: React.FC<LocalInputProps> = ({
  className,
  label,
  ...props
}) => {
  return (
    <FormControl className={className} label={label || ""}>
      <Input {...props} className="!min-w-0" />
    </FormControl>
  );
};

export default memo(
  MemoInput,
  (prevProps, nextProps) => prevProps.value === nextProps.value
);
