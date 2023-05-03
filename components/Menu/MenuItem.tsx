import { ComponentProps } from "react";
import classNames from "classnames";
import { FaShoppingCart } from "react-icons/fa";

import { IMenuItemCompositionItem, ISidesItem } from "/models/MenuItem";
import EditableSection from "../EditableSection";
import { useSession } from "next-auth/react";
import { IUser } from "/models/User";
import getHighlightedText from "/lib/getHighlightedText";
import MoneyDisplay from "../MoneyDisplay";
import { Button } from "@chakra-ui/react";
import ImageWithFallback from "/components/ImageWithFallback";

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
  displayOnly?: boolean;
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
  displayOnly,
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

  return !admin && hidden ? null : (
    <div
      className={classNames(
        "sm:flex sm:flex-col h-full relative rounded-2xl overflow-hidden shadow-md text-contrast-a11y-high bg-contrast-high border-contrast-high border-4 group cursor-pointer z-0 outline outline-contrast-low outline-1",
        {
          "sm:hover:scale-[105%] transition-all": useEffects,
          "opacity-50": hidden,
          "sm:rounded-tr-none": price,
        },
        className
      )}
      {...props}
    >
      <div className="relative float-left sm:float-none pr-0">
        {price ? (
          <MoneyDisplay
            className="absolute top-0 right-2 sm:right-0 bg-contrast-high p-1 sm:p-2 rounded-bl-2xl z-10 text-end border-l border-b border-main-a11y-low"
            value={price}
            promotional={pricePromotional}
          />
        ) : null}
        <EditableSection
          className="!border !border-main-a11y-low rounded-xl overflow-hidden mr-2 sm:mr-0"
          iconsContainerClassName="bottom-1 sm:bottom-8 !top-auto bg-contrast-high p-2 rounded-full"
          hideEdit={!editable}
          hideDelete={!editable}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        >
          <ImageWithFallback
            className="w-32 h-32 sm:w-full sm:h-full aspect-square bg-main-200 object-cover"
            src={mainImageId}
            width={500}
            height={500}
            alt={`${name} hero image`}
            priority
          />
        </EditableSection>
      </div>
      <div
        className={classNames(
          "flex-1 sm:relative bottom-0 w-full p-0 px-2 sm:p-4 sm:flex sm:flex-col bg-contrast-high sm:-translate-y-6 rounded-tl-2xl rounded-tr-2xl sm:mr-0 sm:border-t border-main-a11y-low",
          { "sm:mb-8": !displayOnly, "sm:-mb-8": displayOnly }
        )}
      >
        <div className="mt-1 min-h-[36px] sm:min-h-0">
          <Button
            className="sm:!hidden inline float-right !rounded-xl w-fit mx-0 !px-4 !py-2 !bg-hero !text-hero-a11y-high ml-1 mb-1"
            onClick={onClick}
          >
            <FaShoppingCart className="text-xl" />
          </Button>
          <h3 className="block text-md font-bold !leading-tight mb-1">
            {getHighlightedText(name, search)}
          </h3>
          {nameDetail && (
            <span className="block text-sm font-bold opacity-60 mb-1 leading-tight">
              {getHighlightedText(nameDetail, search)}
            </span>
          )}
        </div>

        <div className="relative flex-1 pb-2 mt-1">
          {descriptionShort && (
            <span className="block text-xs leading-tight">
              {getHighlightedText(descriptionShort, search)}
            </span>
          )}
          {sides?.length ? (
            <ul className="flex flex-col text-xs pt-2 border-t-[1px] mt-1 border-contrast-a11y-low">
              {sides?.map((side) => (
                <li className="block" key={side.menuItem.name}>
                  <span className="font-bold">
                    {side.quantity > 0 ? `${side.quantity}x ` : "• "}
                  </span>
                  {side.menuItem.name}
                  {side.menuItem.nameDetail && ` - ${side.menuItem.nameDetail}`}
                </li>
              ))}
            </ul>
          ) : null}
          {(composition?.filter((f) => f.ingredient).length || 0) > 0 && (
            <ul className="text-xs pt-1 opacity-60">
              <span>Ingredientes: </span>
              {composition
                ?.filter((f) => f.ingredient)
                .map((compositionItem) =>
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
      {!displayOnly && (
        <div className="hidden sm:block absolute bottom-0 right-0 left-0 p-4">
          <Button
            className="uppercase !rounded-xl w-[calc(100%+1rem)] -mx-2 mt-2 !px-6 !py-6 flex flex-row gap-2 items-center justify-center !bg-hero !text-hero-a11y-high"
            onClick={onClick}
          >
            <FaShoppingCart className="text-xl" />
            <span className="inline-block">Adicionar</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuItem;
