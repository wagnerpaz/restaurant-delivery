import { ComponentProps } from "react";
import classNames from "classnames";

import Button from "/components/Button";

interface MenuSectionHeaderProps extends ComponentProps<"form"> {
  name: string;
  length: number;
  onAddClick: () => void;
}

const MenuSectionHeader: React.FC<MenuSectionHeaderProps> = ({
  className,
  children,
  name,
  length,
  onAddClick,
  ...props
}) => {
  return (
    <form
      className={classNames(
        "flex flex-row items-center px-4 h-12 sticky top-[82px] bg-dark-300 text-light-high mb-2 sm:mb-6 z-10",
        className
      )}
      onClick={(e) => e.preventDefault()}
      {...props}
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
  );
};

export default MenuSectionHeader;
