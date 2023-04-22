import { ComponentProps } from "react";
import classNames from "classnames";
import { IoFastFood } from "react-icons/io5";
import { FaCodeBranch } from "react-icons/fa";
import { RiEditFill } from "react-icons/ri";
import { IoIosAddCircle } from "react-icons/io";

import { useSession } from "next-auth/react";
import { IUser } from "/models/User";

interface MenuSectionHeaderProps extends ComponentProps<"form"> {
  name?: string;
  length?: number;
  totalLength?: number;
  isNew?: boolean;
  onAddMenuItemClick?: () => void;
  onAddSectionClick?: () => void;
  onEditSectionClick?: () => void;
}

const MenuSectionHeader: React.FC<MenuSectionHeaderProps> = ({
  className,
  children,
  name,
  length,
  totalLength,
  isNew,
  onAddMenuItemClick = () => {},
  onAddSectionClick = () => {},
  onEditSectionClick = () => {},
  ...props
}) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  return (
    <form
      className={classNames(
        "flex flex-row items-center px-4 py-2 min-h-12 sticky top-[var(--header-height)] bg-main-100 text-main-a11y-high z-10 shadow-md border-hero border-t-2",
        { "mb-4 sm:mb-6": length > 0 },
        className
      )}
      onClick={(e) => e.preventDefault()}
      {...props}
    >
      <div className="flex flex-row container align-center justify-between m-auto font-bold text-md sm:text-xl">
        <div className="flex flex-row flex-wrap gap-x-2">
          {admin && !isNew && (
            <>
              <RiEditFill
                className="cursor-pointer"
                size={24}
                title="Editar Seção"
                onClick={onEditSectionClick}
              />
              <FaCodeBranch
                className="mt-1 cursor-pointer"
                size={20}
                title="Adicionar Sub-Seção do Menu"
                onClick={onAddSectionClick}
              />
            </>
          )}
          {admin && isNew && (
            <div className="flex flex-row gap-3 items-center text-sm">
              <IoIosAddCircle
                className="mt-1 cursor-pointer"
                size={24}
                title="Adicionar Seção do Menu"
                onClick={onAddSectionClick}
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
              ({length} de {totalLength} item{(totalLength || 0) > 1 ? "s" : ""}
              )
            </span>
          ) : null}
        </div>

        {admin && !isNew && (
          <div className="flex flex-row gap-3 items-center text-sm">
            <IoFastFood
              className="cursor-pointer"
              size={24}
              onClick={onAddMenuItemClick}
              title="Adicionar Item do Menu"
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default MenuSectionHeader;
