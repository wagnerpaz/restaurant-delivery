import { Select } from "chakra-react-select";
import { ComponentProps, ReactElement, useMemo } from "react";
import { onlyText } from "react-children-utilities";
import MoneyDisplay from "./MoneyDisplay";

import DbImage from "/components/DbImage";
import FormControl from "/components/FormControl";
import {
  composeFullSectionNameByIndex,
  findMenuItemSectionIndex,
  listAllSections,
  listAllSectionsIndexes,
  navigateBySectionIndex,
  retriveAllMenuItems,
} from "/lib/menuSectionUtils";
import removeDiacritics from "/lib/removeDiacritics";
import { IMenuItem } from "/models/MenuItem";
import { IMenuSection, IStore } from "/models/Store";

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
      <FormControl className="flex-1" label="Seção">
        <Select
          useBasicStyles
          menuPosition="fixed"
          menuPlacement="auto"
          menuPortalTarget={menuPortalTarget}
          classNames={{ menuPortal: () => "!z-50" }}
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
      </FormControl>
      <FormControl className="flex-1" label="Item">
        <Select
          useBasicStyles
          menuPosition="fixed"
          menuPlacement="auto"
          menuPortalTarget={menuPortalTarget}
          classNames={{ menuPortal: () => "!z-50" }}
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
                    <DbImage
                      className="rounded-md"
                      id={menuItem?.images?.main?.toString()}
                      width={30}
                      height={30}
                      alt="Ingrediente foto"
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
                      <DbImage
                        className="rounded-md"
                        id={menuItem.images?.main?.toString()}
                        width={30}
                        height={30}
                        alt="menu item foto"
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
      </FormControl>
    </div>
  );
};

export default MenuItemBySectionSelector;
