import ImageWithFallback from "/components/ImageWithFallback";
import { ComponentProps, useMemo } from "react";
import { onlyText } from "react-children-utilities";
import MoneyDisplay from "./MoneyDisplay";

import {
  composeFullSectionNameByIndex,
  listAllSectionsIndexes,
  navigateBySectionIndex,
} from "/lib/menuSectionUtils";
import removeDiacritics from "/lib/removeDiacritics";
import { IMenuItem } from "/models/types/MenuItem";
import { IMenuSection, IStore } from "/models/types/Store";
import ReactSelect from "./ReactSelect";

interface MenuItemBySectionSelectorProps extends ComponentProps<"div"> {
  store: IStore;
  menuSectionIndex: string;
  menuItem: IMenuItem | null;
  menuPortalTarget?: HTMLElement | null;
  allowAll?: boolean;
  onMenuSectionChange: (newSection: IMenuSection | null) => void;
  onMenuItemChange: (newItem: IMenuItem | null) => void;
}

const MenuItemBySectionSelector: React.FC<MenuItemBySectionSelectorProps> = ({
  store,
  menuSectionIndex,
  menuItem,
  menuPortalTarget,
  onMenuSectionChange = () => {},
  onMenuItemChange = () => {},
  allowAll,
  ...props
}) => {
  const menuSectionFullName = useMemo(
    () =>
      menuSectionIndex
        ? composeFullSectionNameByIndex(
            store?.menu.sections,
            menuSectionIndex.split(",").map((m) => +m)
          )
        : "",
    [store, menuSectionIndex]
  );

  const allSectionsIndexesListed = useMemo(
    () => listAllSectionsIndexes(store?.menu.sections || []),
    [store]
  );

  const selectedSectionItems = useMemo(
    () =>
      menuSectionIndex
        ? navigateBySectionIndex(
            store.menu.sections,
            menuSectionIndex.split(",").map((m) => +m)
          ).items
        : [],
    [store.menu.sections, menuSectionIndex]
  );

  const allowAllIfPossible = (array: any[]) => {
    if (allowAll) {
      return [{ value: null, label: "Todos" }, ...array];
    }
    return array;
  };

  return (
    <div className="flex flex-row flex-1 gap-4">
      <ReactSelect
        label="Seção"
        useBasicStyles
        menuPosition="fixed"
        menuPlacement="auto"
        menuPortalTarget={menuPortalTarget}
        classNames={{ menuPortal: () => "!z-50", container: () => "flex-1" }}
        value={{
          value: menuSectionIndex,
          label: menuSectionFullName,
        }}
        options={[...allSectionsIndexesListed].map((sectionIndex) => ({
          value: sectionIndex.join(","),
          label: composeFullSectionNameByIndex(
            store.menu.sections,
            sectionIndex
          ),
        }))}
        onChange={(e) => onMenuSectionChange(e?.value)}
      />
      <ReactSelect
        useBasicStyles
        menuPosition="fixed"
        menuPlacement="auto"
        menuPortalTarget={menuPortalTarget}
        classNames={{ menuPortal: () => "!z-50", container: () => "flex-1" }}
        filterOption={({ label }, inputValue) =>
          removeDiacritics(onlyText(label.props.children))
            .toLowerCase()
            .includes(removeDiacritics(inputValue).toLowerCase())
        }
        value={{
          value: menuItem?._id,
          label: (
            <div className="flex flex-row items-center gap-2 justify-between w-full">
              <div className="flex flex-row items-center">
                {menuItem?.images?.main && (
                  <ImageWithFallback
                    className="rounded-md"
                    src={menuItem?.images?.main}
                    width={30}
                    height={30}
                    alt="Ingrediente foto"
                    cdn
                  />
                )}
                {menuItem?.name || (allowAll && "Todos")}
              </div>
              <MoneyDisplay zeroInvisible plus value={menuItem?.price} />
            </div>
          ),
        }}
        options={allowAllIfPossible(
          [...selectedSectionItems]
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((menuItem) => ({
              value: menuItem._id,
              label: (
                <div className="flex flex-row items-center justify-between gap-2 w-full">
                  <div className="flex flex-row items-center">
                    <ImageWithFallback
                      className="rounded-md"
                      src={menuItem.images?.main?.toString()}
                      width={30}
                      height={30}
                      alt="menu item foto"
                      cdn
                    />
                    <span>
                      {menuItem.name}
                      {menuItem.nameDetail && ` (${menuItem.nameDetail})`}
                    </span>
                  </div>
                  <MoneyDisplay zeroInvisible plus value={menuItem.price} />
                </div>
              ),
            }))
        )}
        onChange={(e) =>
          onMenuItemChange(
            selectedSectionItems.find((f) => f._id === e?.value) || null
          )
        }
      />
    </div>
  );
};

export default MenuItemBySectionSelector;
