import { memo } from "react";

import FormControl from "/components/FormControl";
import ReactSelect from "./ReactSelect";

interface LocalSimpleSelectProps {
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
      <ReactSelect {...props} />
    </FormControl>
  );
};

export default memo(
  LocalSimpleSelect,
  (prevProps, nextProps) => prevProps.value === nextProps.value
);
