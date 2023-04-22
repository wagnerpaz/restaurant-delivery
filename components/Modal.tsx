import { ComponentProps, useRef } from "react";
import classNames from "classnames";
import useOnClickOutside from "/lib/hooks/useOnClickOutside";
import { createPortal } from "react-dom";

interface ModalProps extends ComponentProps<"div"> {
  open: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
  noAutoClose?: boolean;
  onOpenChange: (newValue: boolean) => void;
  onEsc?: (e: KeyboardEvent) => void;
  portalTarget?: () => HTMLElement | null;
}

const Modal: React.FC<ModalProps> = ({
  className,
  backgroundClassName,
  contentClassName,
  children,
  open,
  noAutoClose,
  portalTarget,
  onOpenChange,
  onEsc = () => onOpenChange(!open),
  ...props
}) => {
  const portalTargetValue = portalTarget?.();

  const render = (
    <>
      <div
        className={classNames(
          "fixed top-0 left-0 w-full h-full bg-main-a11y-medium opacity-70 z-20",
          "hidden sm:block",
          backgroundClassName
        )}
        onClick={() => onOpenChange(!open)}
        {...props}
      />
      <div
        className={classNames(
          "fixed inset-0 container mx-auto m-4 z-30 flex items-center justify-center",
          "h-[100vh-var(--header-height)] sm:h-auto my-0 sm:my-4 top-[--header-height] sm:top-0",
          className
        )}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onEsc(e);
          }
        }}
        {...props}
      >
        <div
          className={classNames(
            "max-w-full max-h-full bg-main-200 p-4 rounded-2xl overflow-auto custom-scrollbar",
            "!rounded-none sm:!rounded-2xl",
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
