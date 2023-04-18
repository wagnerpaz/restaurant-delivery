import { ComponentProps } from "react";
import classNames from "classnames";

import Button from "/components/Button";
import { useSession } from "next-auth/react";
import { IUser } from "/models/User";

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
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  return (
    <form
      className={classNames(
        "flex flex-row items-center px-4 py-2 min-h-12 sticky top-[82px] bg-main-100 text-main-a11y-high z-10 shadow-md",
        { "mb-4 sm:mb-6": length > 0 },
        className
      )}
      onClick={(e) => e.preventDefault()}
      {...props}
    >
      <div className="flex flex-row container align-center justify-between m-auto font-bold text-md sm:text-xl">
        <div className="flex flex-row flex-wrap gap-x-2">
          <span>{name}</span>
          <span className="text-main-a11y-medium font-normal">
            ({length} items)
          </span>
        </div>
        {admin && (
          <Button
            className="ml-4 justify-self-end text-main-a11y-high"
            variant="text"
            onClick={onAddClick}
          >
            Adicionar
          </Button>
        )}
      </div>
    </form>
  );
};

export default MenuSectionHeader;
