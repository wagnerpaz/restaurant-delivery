import { memo } from "react";
import { Input, InputProps } from "@chakra-ui/react";

import FormControl from "/components/FormControl";

interface LocalInputProps extends InputProps {
  label?: string;
  className: string;
}

const LocalInput: React.FC<LocalInputProps> = ({
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
  LocalInput,
  (prevProps, nextProps) => prevProps.value === nextProps.value
);
