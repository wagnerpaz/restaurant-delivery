import { ComponentProps } from "react";
import classNames from "classnames";

import Button from "/components/Button";
import { IMenuItem } from "/models/MenuItem";

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
      <form
        className="flex flex-row items-center px-4 h-12 sticky top-0 bg-dark-300 text-light-high mb-2 sm:mb-4"
        onClick={(e) => e.preventDefault()}
      >
        <div className="flex flex-row container align-center justify-between m-auto font-bold text-xl">
          <div>
            <span>{name}</span>
            <span className="text-light-medium font-normal ml-2">
              ({length} items)
            </span>
          </div>
          <Button
            className="ml-4 justify-self-end"
            variant="text"
            onClick={onAddClick}
          >
            Adicionar
          </Button>
        </div>
      </form>
      <section
        className={classNames(
          "sm:container sm:m-auto px-2 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-6 sm:mb-4",
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
