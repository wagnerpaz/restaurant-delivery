import { ComponentProps } from "react";
import classNames from "classnames";
import { FaShoppingCart } from "react-icons/fa";

import { IMenuItemCompositionItem, ISidesItem } from "/models/MenuItem";
import EditableSection from "../EditableSection";
import DbImage from "../DbImage";
import { useSession } from "next-auth/react";
import { IUser } from "/models/User";
import getHighlightedText from "/lib/getHighlightedText";
import MoneyDisplay from "../MoneyDisplay";
import { Button } from "@chakra-ui/react";

interface MenuItemProps extends ComponentProps<"div"> {
  id: string;
  name: string;
  nameDetail?: string;
  index: number;
  mainImageId?: string;
  price?: number;
  pricePromotional?: number;
  hidden?: boolean;
  descriptionShort?: string;
  descriptionLong?: string;
  composition?: IMenuItemCompositionItem[];
  sides?: ISidesItem[];
  editable?: boolean;
  useEffects?: boolean;
  search?: string;
  portalTargetEditModal?: () => HTMLElement;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onClick?: () => void;
  onUploadIdChange?: (id: string) => void;
  onMainImageChange?: (newMainImageId: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  className,
  children,
  id,
  name,
  nameDetail,
  index,
  mainImageId,
  price,
  pricePromotional,
  hidden,
  descriptionShort,
  composition,
  sides,
  editable = false,
  useEffects = false,
  search = "",
  portalTargetEditModal,
  onEditClick,
  onDeleteClick,
  onClick,
  onUploadIdChange = () => {},
  onMainImageChange = () => {},
  ...props
}) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const priceNew = pricePromotional ? pricePromotional : price;
  const priceOld = pricePromotional ? price : undefined;

  return !admin && hidden ? null : (
    <div
      className={classNames(
        "sm:flex sm:flex-col h-full relative rounded-2xl  overflow-hidden shadow-md text-contrast-a11y-high bg-contrast-high border-contrast-high border-4 group cursor-pointer z-0 outline outline-contrast-low outline-1",
        {
          "sm:hover:scale-[105%] transition-all": useEffects,
          "opacity-50": hidden,
          "sm:rounded-tr-none": priceNew,
        },
        className
      )}
      {...props}
    >
      <div className="relative float-left sm:float-none">
        {priceNew ? (
          <MoneyDisplay
            className="absolute top-0 right-0 bg-contrast-high p-2 rounded-bl-2xl z-10 pt-2 text-end"
            oldValue={priceOld}
            value={priceNew}
          />
        ) : null}
        <EditableSection
          iconsContainerClassName="bottom-1 sm:bottom-8 !top-auto bg-contrast-high p-2 rounded-full"
          hideEdit={!editable}
          hideDelete={!editable}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        >
          <DbImage
            className="w-32 h-32 sm:w-full sm:h-full bg-main-200 rounded-xl mr-2"
            id={mainImageId}
            width={99999}
            height={99999}
            alt={`${name} hero image`}
          />
        </EditableSection>
      </div>
      <div className="flex-1 sm:relative bottom-0 w-full p-1 px-2 sm:p-4 sm:mb-8 sm:flex sm:flex-col bg-contrast-high sm:-translate-y-6 rounded-tl-2xl rounded-tr-2xl sm:mr-0">
        <div className="flex flex-col justify-center flex-wrap min-h-[36px]">
          <h3 className="block text-md font-bold mr-12 sm:mr-0 leading-tight">
            {getHighlightedText(name, search)}
          </h3>
          {nameDetail && (
            <span className="text-md font-bold mr-12 sm:mr-0 opacity-60 mb-1">
              {getHighlightedText(nameDetail, search)}
            </span>
          )}
        </div>

        <div className="relative flex-1 pb-2">
          {descriptionShort && (
            <span className="block text-xs leading-tight">
              {getHighlightedText(descriptionShort, search)}
            </span>
          )}
          {sides?.length ? (
            <ul className="flex flex-col text-xs mt-2 pt-2 border-t-[1px] border-contrast-a11y-low">
              {sides?.map((side) => (
                <li className="block" key={side.menuItem.name}>
                  <span className="font-bold">{`${side.quantity}x `}</span>
                  {side.menuItem.name}
                </li>
              ))}
            </ul>
          ) : null}
          {(composition?.length || 0) > 0 && (
            <ul className="text-xs pt-1 opacity-60">
              <span>Ingredientes: </span>
              {composition
                ?.map((compositionItem) =>
                  compositionItem.ingredient ? (
                    <li
                      className="inline"
                      key={compositionItem.ingredient.name}
                    >
                      {compositionItem.quantity &&
                      compositionItem.quantity !== 1
                        ? `${compositionItem.quantity}x `
                        : ""}
                      {compositionItem.ingredient.name}
                    </li>
                  ) : null
                )
                .flatMap((item) => [item, ", "])
                .slice(0, -1)}
            </ul>
          )}
        </div>
      </div>
      <div className="absolute top-0 sm:top-auto sm:bottom-0 right-0 sm:left-0 sm:right-0 p-1 sm:p-4">
        <Button
          className="uppercase !rounded-xl w-full sm:w-[calc(100%+1rem)] mx-0 sm:-mx-2 sm:mt-2 !px-4 !py-2 sm:!px-6 sm:!py-6 flex flex-row gap-2 items-center justify-center !bg-hero text-hero-a11y-high"
          onClick={onClick}
        >
          <FaShoppingCart className="text-xl" />
          <span className="hidden sm:inline-block">Adicionar</span>
        </Button>
      </div>
    </div>
  );
};

export default MenuItem;
