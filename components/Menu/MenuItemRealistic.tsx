import { ComponentProps, useContext, useMemo } from "react";
import classNames from "classnames";
import { FaShoppingCart } from "react-icons/fa";

import {
  IMenuItem,
  IMenuItemCompositionItem,
  ISidesItem,
} from "/models/types/MenuItem";
import EditableSection from "../EditableSection";
import { useSession } from "next-auth/react";
import { IUser } from "/models/types/User";
import getHighlightedText from "/lib/getHighlightedText";
import MoneyDisplay from "../MoneyDisplay";
import { Button } from "@chakra-ui/react";
import ImageWithFallback from "/components/ImageWithFallback";
import getTailwindScreenSize from "/lib/tailwind/getTailwindScreenSize";
import { GRID_CONFIG } from "./MenuSection";
import remToPix from "/lib/remToPix";
import { StoreContext } from "../Store";
import ScreenSizeContext from "/contexts/BrowserScreenSizeContext";

interface MenuItemProps extends ComponentProps<"div"> {
  idPrefix?: string;
  index: number;
  menuItem: IMenuItem;
  price?: number;
  pricePromotional?: number;
  hidden?: boolean;
  descriptionShort?: string;
  descriptionLong?: string;
  composition?: IMenuItemCompositionItem[];
  sides?: ISidesItem[];
  editable?: boolean;
  useEffects?: boolean;
  portalTargetEditModal?: () => HTMLElement;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onClick?: () => void;
  onUploadIdChange?: (id: string) => void;
  onMainImageChange?: (newMainImageId: string) => void;
}

const MenuItemRealistic: React.FC<MenuItemProps> = ({
  style,
  className,
  children,
  idPrefix = "",
  index,
  menuItem,
  hidden,
  useEffects = false,
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

  const { search } = useContext(StoreContext);
  const { screenSizeWidth } = useContext(ScreenSizeContext);

  const id = menuItem._id;
  const name = menuItem.name;
  const nameDetail = menuItem.nameDetail;
  const mainImageId = menuItem.images?.main;
  const price = menuItem.price;
  const pricePromotional = menuItem.pricePromotional;
  const descriptionShort = menuItem.details?.short;
  const composition = menuItem.composition;
  const sides = menuItem.sides;

  const editable = admin;

  const [screenSizeType] = useMemo(
    () => getTailwindScreenSize(screenSizeWidth),
    [screenSizeWidth]
  );
  const width = useMemo(
    () => calculateComponentWidth(screenSizeWidth),
    [screenSizeWidth]
  );

  const imageSize = useMemo(
    () => (screenSizeType === "xs" ? remToPix(8) : width - 4 * 2),
    [screenSizeType, width]
  );

  return (
    <div
      id={idPrefix + id}
      className={classNames(
        "menu-item-realist-container group",
        {
          "sm:hover:scale-[105%] transition-all": useEffects,
          "opacity-50": hidden,
          "sm:rounded-tr-none": price,
        },
        className
      )}
      style={style}
      {...props}
    >
      <div className="relative float-left sm:float-none pr-0">
        {price ? (
          <MoneyDisplay
            className="menu-item-realistic-money-display"
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
            width={imageSize}
            height={imageSize}
            alt={`${name} hero image`}
          />
        </EditableSection>
      </div>
      <div className={"menu-item-realistic-content-container"}>
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
      <div className="hidden sm:block absolute bottom-0 right-0 left-0 p-4">
        <Button
          className="button-hero-1 !rounded-xl w-[calc(100%+1rem)] -mx-2"
          onClick={onClick}
        >
          <FaShoppingCart className="text-xl" />
          <span className="inline-block">Adicionar</span>
        </Button>
      </div>
    </div>
  );
};

export function calculateComponentWidth(screenWidth: number) {
  const [screenSizeType, screenSize] = getTailwindScreenSize(screenWidth);
  const cols = GRID_CONFIG[screenSizeType].cols;
  const gap = GRID_CONFIG[screenSizeType].gap;

  const width =
    (screenSize -
      remToPix(GRID_CONFIG.marginX * 2) -
      remToPix(gap) * (cols - 1)) /
    cols;

  return width;
}

export default MenuItemRealistic;
