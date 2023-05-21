import { memo } from "react";
import isEqual from "nano-equal";

import ReactSelect from "./ReactSelect";

interface LocalSimpleSelectProps {
  label?: string;
  className: string;
}

const MemoReactSelect: React.FC<LocalSimpleSelectProps> = ({ ...props }) => {
  return <ReactSelect {...props} />;
};

export default memo(MemoReactSelect, (prevProps, nextProps) =>
  isEqual(prevProps.value, nextProps.value)
);
