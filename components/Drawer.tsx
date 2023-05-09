import { ComponentProps } from "react";
import classNames from "classnames";
import { IoMdClose } from "react-icons/io";
import useDisableScroll from "/lib/hooks/useDisableScroll";

interface DrawerProps extends ComponentProps<"div"> {
  title?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  className,
  children,
  title,
  open,
  onClose,
  ...props
}) => {
  useDisableScroll(open);

  return (
    <div
      className={classNames("text-main-a11y-high transition-all", className)}
      {...props}
    >
      <div
        className={classNames(
          "fixed inset-0 bg-main-a11y-high opacity-50 transition-all",
          {
            "!opacity-0 pointer-events-none": !open,
          }
        )}
        onClick={onClose}
      />
      <div
        className={classNames(
          "fixed top-0 -right-80 w-80 h-full bg-main-100 transition-all",
          {
            "!right-0": open,
          }
        )}
      >
        <div className="py-4 px-6 flex flex-row items-center justify-between border-b border-main-a11y-low">
          <h2 className="text-xl font-bold">{title}</h2>
          <IoMdClose className="cursor-pointer" size={30} onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Drawer;
