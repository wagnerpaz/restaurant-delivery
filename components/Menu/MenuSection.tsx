import { ComponentProps } from "react";
import classNames from "classnames";
import { useSession } from "next-auth/react";

import MenuSectionHeader from "/components/Menu/MenuSectionHeader";
import { IUser } from "/models/User";
import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";

interface MenuSectionProps extends ComponentProps<typeof AccordionPanel> {
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
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  return (
    <AccordionItem className="!border-t-0">
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
      <AccordionPanel
        className={classNames(
          "sm:container sm:m-auto px-2 sm:px-8",
          {
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6":
              editMode === "realistic" || !admin,
            "flex flex-col gap-2": editMode === "fast" && admin,
          },
          { "my-4 sm:my-6": true },
          className
        )}
        {...props}
      >
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default MenuSection;
