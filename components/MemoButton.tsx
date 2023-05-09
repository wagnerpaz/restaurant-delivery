import { memo } from "react";

import Button from "/components/form/Button";

interface LocalButtonProps {
  label?: string;
  className: string;
}

const MemoButton: React.FC<LocalButtonProps> = ({
  className,
  label,
  ...props
}) => {
  return <Button {...props} className="!min-w-0" />;
};

export default memo(
  MemoButton,
  (prevProps, nextProps) =>
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.onClick === nextProps.onClick
);
