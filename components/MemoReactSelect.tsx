import { memo } from "react";

import ReactSelect from "./ReactSelect";
import isEqual from "lodash.isequal";

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
