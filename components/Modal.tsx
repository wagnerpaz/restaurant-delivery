import { ComponentProps, useRef } from "react";
import classNames from "classnames";
import useOnClickOutside from "/lib/hooks/useOnClickOutside";
import { createPortal } from "react-dom";

interface ModalProps extends ComponentProps<"div"> {
  open: boolean;
  contentClassName?: string;
  noAutoClose?: boolean;
  onOpenChange: (newValue: boolean) => void;
  portalTarget?: () => HTMLElement | null;
}

const Modal: React.FC<ModalProps> = ({
  className,
  contentClassName,
  children,
  open,
  noAutoClose,
  portalTarget,
  onOpenChange,
  ...props
}) => {
  const container = useRef<HTMLDivElement>(null);

  useOnClickOutside(container, () => {
    !noAutoClose && onOpenChange(false);
  });

  const portalTargetValue = portalTarget?.();

  const render = (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-main-a11y-medium opacity-70 z-20"
        {...props}
      />
      <div
        className={classNames(
          "fixed inset-0 container mx-auto m-4 z-50 flex items-center justify-center",
          className
        )}
        {...props}
      >
        <div
          ref={container}
          className={classNames(
            "max-w-full max-h-full bg-main-200 p-4 rounded-2xl overflow-auto custom-scrollbar",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </>
  );

  return open
    ? portalTargetValue
      ? createPortal(render, portalTargetValue)
      : render
    : null;
};

Modal.displayName = "Modal";

export default Modal;
