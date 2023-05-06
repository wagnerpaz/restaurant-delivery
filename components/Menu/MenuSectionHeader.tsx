import { ComponentProps, useContext } from "react";
import classNames from "classnames";
import { FaCodeBranch, FaThList } from "react-icons/fa";
import { RiEditFill } from "react-icons/ri";
import { IoIosAddCircle } from "react-icons/io";
import { useSession } from "next-auth/react";
import { BsFillCloudArrowUpFill, BsMicrosoft } from "react-icons/bs";
import { MdMoveDown } from "react-icons/md";
import {
  AccordionButton,
  AccordionIcon,
  useAccordionItemState,
} from "@chakra-ui/react";

import { IUser } from "/models/User";
import usePutStoreMenuSection from "/hooks/usePutStoreMenuSection";
import usePutMenuItem from "/hooks/usePutMenuItem";
import { StoreContext } from "../Store";
import { MenuSectionContext } from "./MenuSection";

interface MenuSectionHeaderProps extends ComponentProps<"button"> {
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

const MenuSectionHeader: React.FC<MenuSectionHeaderProps> = ({
  className,
  children,
  name,
  length,
  totalLength,
  isNew,
  editMode = "realistic",
  onAddMenuItemClick = () => {},
  onAddSectionClick = () => {},
  onEditSectionClick = () => {},
  onTrashClick = () => {},
  onFastEditClick = () => {},
  ...props
}) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const { store } = useContext(StoreContext);
  const { menuSection, setMenuSection } = useContext(MenuSectionContext);

  const { isOpen } = useAccordionItemState();

  const putMenuSection = usePutStoreMenuSection();

  const stopPropagation = (
    e: MouseEvent,
    callback: (e: MouseEvent) => void
  ) => {
    e.stopPropagation();
    callback(e);
  };

  return (
    <div className="bg-main-100 sticky top-[calc(var(--header-height)-2px)] z-10 shadow-md border-hero border-t-2">
      <AccordionButton
        className={classNames(
          "flex flex-row items-center px-4 py-2 min-h-12 text-main-a11y-high  ",
          className
        )}
        onClick={() => {
          const newObj = { ...menuSection, retracted: isOpen };
          putMenuSection(store, newObj, menuSection.index);
          setMenuSection(newObj);
        }}
        {...props}
      >
        <div className="flex flex-row container align-center justify-between m-auto font-bold text-md sm:text-xl">
          <div className="flex flex-row flex-wrap gap-x-2 items-center">
            {admin && !isNew && (
              <>
                <RiEditFill
                  className="cursor-pointer"
                  size={24}
                  title="Editar Seção"
                  onClick={(e) => stopPropagation(e, onEditSectionClick)}
                />
                <FaCodeBranch
                  className="cursor-pointer"
                  size={20}
                  title="Adicionar Sub-Seção do Menu"
                  onClick={(e) => stopPropagation(e, onAddSectionClick)}
                />
                <MdMoveDown
                  className="cursor-pointer"
                  size={24}
                  title="Move Seção"
                  onClick={(e) => stopPropagation(e, onAddSectionClick)}
                />
              </>
            )}
            {admin && isNew && (
              <div className="flex flex-row gap-3 items-center text-sm">
                <IoIosAddCircle
                  className="mt-1 cursor-pointer"
                  size={24}
                  title="Adicionar Seção do Menu"
                  onClick={(e) => stopPropagation(e, onAddSectionClick)}
                />
              </div>
            )}

            {name && <span>{name}</span>}
            {length === totalLength && length > 0 ? (
              <span className="text-main-a11y-medium font-normal">
                ({length} item{(totalLength || 0) > 1 ? "s" : ""})
              </span>
            ) : null}

            {length !== totalLength ? (
              <span className="text-main-a11y-medium font-normal">
                ({length} de {totalLength} item
                {(totalLength || 0) > 1 ? "s" : ""})
              </span>
            ) : null}
          </div>

          {admin && !isNew && (
            <div className="flex flex-row gap-3 items-center text-sm">
              {editMode === "realistic" ? (
                <BsMicrosoft
                  className="cursor-pointer mt-1"
                  size={20}
                  onClick={(e) => stopPropagation(e, onFastEditClick)}
                  title="Edição realista (cartões)"
                />
              ) : (
                <FaThList
                  className="cursor-pointer mt-1"
                  size={20}
                  onClick={(e) => stopPropagation(e, onFastEditClick)}
                  title="Edição rápida (lista)"
                />
              )}
              <BsFillCloudArrowUpFill
                className="cursor-pointer mt-1"
                size={26}
                onClick={(e) => stopPropagation(e, onTrashClick)}
                title="Núvem"
              />
              <AccordionIcon />
            </div>
          )}
          {!admin && <AccordionIcon />}
        </div>
      </AccordionButton>
    </div>
  );
};

export default MenuSectionHeader;
