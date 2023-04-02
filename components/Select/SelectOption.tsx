import { ComponentProps, ReactNode } from "react";
import classNames from "classnames";
import Image from "next/image";
import { Menu } from "@headlessui/react";

interface SelectOptionProps extends ComponentProps<typeof Menu.Item> {}

const SelectOption: React.FC<SelectOptionProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href="#"
          className={classNames(
            active ? "bg-dark-300 text-light-high" : "text-light-medium",
            "block px-4 py-2 text-sm"
          )}
        >
          {children as ReactNode}
        </a>
      )}
    </Menu.Item>
  );
};

export default SelectOption;
