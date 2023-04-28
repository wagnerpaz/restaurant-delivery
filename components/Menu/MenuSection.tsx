import { ComponentProps, useEffect, useRef } from "react";
import classNames from "classnames";

import MenuSectionHeader from "./MenuSectionHeader";

interface MenuSectionProps extends ComponentProps<"section"> {
  name?: string;
  length?: number;
  totalLength?: number;
  isNew?: boolean;
  editMode?: "realistic" | "fast";
  onAddMenuItemClick?: () => void;
  onAddSectionClick?: () => void;
  onEditSectionClick?: () => void;
  onTrashClick?: () => void;
  onFastEditClick?: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  id,
  className,
  children,
  name,
  length,
  totalLength,
  isNew,
  editMode,
  onAddMenuItemClick,
  onAddSectionClick,
  onEditSectionClick,
  onTrashClick,
  onFastEditClick,
  ...props
}) => {
  return (
    <div>
      <a id={id} className="relative -top-[80px]" />
      <MenuSectionHeader
        name={name}
        length={length}
        totalLength={totalLength}
        isNew={isNew}
        editMode={editMode}
        onAddMenuItemClick={onAddMenuItemClick}
        onAddSectionClick={onAddSectionClick}
        onEditSectionClick={onEditSectionClick}
        onTrashClick={onTrashClick}
        onFastEditClick={onFastEditClick}
      />
      <section
        className={classNames(
          "sm:container sm:m-auto px-4 sm:px-8",
          {
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6":
              editMode === "realistic",
            "flex flex-col gap-2": editMode === "fast",
          },
          { "mb-4 sm:mb-6": length > 0 },
          className
        )}
        {...props}
      >
        {children}
      </section>
    </div>
  );
};

export default MenuSection;
