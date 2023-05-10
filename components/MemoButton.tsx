import { memo, ComponentProps } from "react";

import Button from "/components/form/Button";

interface MemoButtonProps extends ComponentProps<typeof Button> {}

const MemoButton: React.FC<MemoButtonProps> = ({ ...props }) => {
  return <Button {...props} />;
};

export default memo(
  MemoButton,
  (prevProps, nextProps) =>
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.onClick === nextProps.onClick
);
