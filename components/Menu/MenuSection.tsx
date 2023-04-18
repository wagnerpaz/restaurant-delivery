import { ComponentProps } from "react";
import classNames from "classnames";

import MenuSectionHeader from "./MenuSectionHeader";

interface MenuSectionProps extends ComponentProps<"section"> {
  name: string;
  length: number;
  onAddClick: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  className,
  children,
  name,
  length,
  onAddClick,
  ...props
}) => {
  return (
    <>
      <MenuSectionHeader name={name} length={length} onAddClick={onAddClick} />
      <section
        className={classNames(
          "sm:container sm:m-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6",
          { "mb-4 sm:mb-6": length > 0 },
          className
        )}
        {...props}
      >
        {children}
      </section>
    </>
  );
};

export default MenuSection;
