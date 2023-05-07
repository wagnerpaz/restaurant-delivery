import { memo } from "react";
import { Select, SelectProps } from "@chakra-ui/react";

import FormControl from "/components/FormControl";

interface LocalSimpleSelectProps extends SelectProps {
  label?: string;
  className: string;
}

const LocalSimpleSelect: React.FC<LocalSimpleSelectProps> = ({
  className,
  label,
  ...props
}) => {
  return (
    <FormControl className={className} label={label || ""}>
      <Select {...props} />
    </FormControl>
  );
};

export default memo(
  LocalSimpleSelect,
  (prevProps, nextProps) => prevProps.value === nextProps.value
);
