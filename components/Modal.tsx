import { ComponentProps, useEffect, useRef, useState } from "react";
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
  const contentRef = useRef<HTMLInputElement>(null);

  const [portalTargetValue, setPortalTargetValue] =
    useState<HTMLElement | null>();

  useEffect(() => {
    if (open) {
      (
        contentRef.current?.querySelector("*[autofocus]") as HTMLInputElement
      )?.focus();
      setPortalTargetValue(portalTarget?.());
    }
  }, [open, portalTarget]);

  const render = (
    <>
      <div
        className={classNames(
          "fixed top-0 left-0 w-full h-full bg-main-a11y-medium opacity-70 z-20",
          "hidden sm:block",
          backgroundClassName
        )}
        {...props}
        onClick={() => !noAutoClose && onOpenChange(!open)}
      />
      <div
        className={classNames(
          "fixed inset-0 container mx-auto m-4 z-30 flex items-center justify-center pointer-events-none",
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
          ref={contentRef}
          className={classNames(
            "h-full sm:h-auto w-full sm:w-auto bg-main-200 p-4 rounded-2xl  overflow-auto custom-scrollbar pointer-events-auto",
            "!rounded-none sm:!rounded-l-2xl",
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
