import { ComponentProps, useRef } from "react";
import classNames from "classnames";
import useOnClickOutside from "/lib/hooks/useOnClickOutside";
import { createPortal } from "react-dom";

interface ModalProps extends ComponentProps<"div"> {
  open: boolean;
  onOpenChange: (newValue: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
  className,
  children,
  open,
  onOpenChange,
  ...props
}) => {
  const container = useRef<HTMLElement>(null);

  useOnClickOutside(container, () => {
    onOpenChange(false);
  });

  return open
    ? createPortal(
        <>
          <div
            className={classNames(
              "fixed top-0 left-0 w-full h-full z-50 bg-dark-500 opacity-70",
              className
            )}
            {...props}
          />
          <div
            ref={container}
            className={classNames(
              "fixed m-16 top-0 left-0 w-[calc(100%-8rem)] h-[calc(100%-8rem)] z-50 bg-dark-100 rounded-2xl p-4 overflow-auto",
              className
            )}
            {...props}
          >
            <div className="relative w-full h-full">{children}</div>
          </div>
        </>,
        document.body
      )
    : null;
};

Modal.displayName = "Modal";

export default Modal;
