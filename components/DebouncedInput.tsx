import { useState } from "react";

import useDebounce from "/lib/hooks/useDebounce";
import Input from "./form/Input";

const DebouncedInput = ({ value, onChange, ...props }) => {
  const [localValue, setLocalValue] = useState(value);

  const debouncedOnChange = useDebounce(onChange);

  return (
    <Input
      onChange={(e) => {
        debouncedOnChange(e);
        setLocalValue(e.target.value);
      }}
      value={localValue}
      {...props}
    />
  );
};

export default DebouncedInput;
