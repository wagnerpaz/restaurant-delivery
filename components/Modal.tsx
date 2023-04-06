import { ComponentProps, useRef } from "react";
import classNames from "classnames";
import useOnClickOutside from "/lib/hooks/useOnClickOutside";
import { createPortal } from "react-dom";

interface ModalProps extends ComponentProps<"div"> {
  open: boolean;
  onOpenChange: (newValue: boolean) => void;
  portalTarget?: () => HTMLElement;
}

const Modal: React.FC<ModalProps> = ({
  className,
  children,
  open,
  portalTarget,
  onOpenChange,
  ...props
}) => {
  const container = useRef<HTMLDivElement>(null);

  useOnClickOutside(container, () => {
    onOpenChange(false);
  });

  return open
    ? createPortal(
        <>
          <div
            className={classNames(
              "fixed top-0 left-0 w-full h-full bg-dark-500 opacity-70",
              className
            )}
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
              className="ma-w-full max-h-full bg-dark-100 p-4 rounded-2xl overflow-auto"
            >
              {children}
            </div>
          </div>
        </>,
        portalTarget?.() || document.body
      )
    : null;
};

Modal.displayName = "Modal";

export default Modal;
