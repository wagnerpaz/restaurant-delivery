import { ComponentProps, useRef } from "react";
import classNames from "classnames";
import useOnClickOutside from "/lib/hooks/useOnClickOutside";

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

  return open ? (
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
          "fixed m-16 top-0 left-0 w-[calc(100%-8rem)] translate-y-1/2 z-50 bg-dark-100 rounded-2xl p-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  ) : null;
};

Modal.displayName = "Modal";

export default Modal;
