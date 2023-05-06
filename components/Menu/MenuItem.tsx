import { useState, useContext, useCallback } from "react";
import { useSession } from "next-auth/react";

import MenuItemEditFast from "/components/Menu/MenuItemEditFast";
import MenuItemRealistic from "/components/Menu/MenuItemRealistic";
import { IMenuItem } from "/models/types/MenuItem";
import { IUser } from "/models/types/User";
import { useRouter } from "next/router";
import { StoreContext } from "../Store";
import useDeleteMenuItem from "/hooks/useDeleteMenuItem";
import { useEditable, useToast } from "@chakra-ui/react";
import defaultToastError from "/config/defaultToastError";
import { MenuSectionContext } from "./MenuSection";

interface MenuItemProps {
  editMode: "realistic" | "fast";
  menuItem: IMenuItem;
  useEffects?: boolean;
  onMenuItemChange: (newMenuItem: IMenuItem) => void;
}

export const emptyMenuItem: IMenuItem = {
  itemType: "product",
  name: "",
  price: 0,
  details: {},
  images: {},
  composition: [],
  customizeType: "template",
};

const MenuItem: React.FC<MenuItemProps> = ({
  editMode,
  menuItem,
  useEffects,
  onMenuItemChange,
}) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const { store } = useContext(StoreContext);
  const { menuSection, setMenuSection } = useContext(MenuSectionContext);

  const toast = useToast();
  const router = useRouter();

  const [localMenuItem, setLocalMenuItem] = useState(menuItem);

  const deleteMenuItem = useDeleteMenuItem();

  const handleEditMenuItem = useCallback(() => {
    router.push(
      `/store/${store.slug}?editMenuItemId=${menuItem._id}`,
      undefined,
      { shallow: true }
    );
  }, [menuItem._id, router, store.slug]);

  const handleDeleteMenuItem = useCallback(async () => {
    let confirmed = true;
    if (menuItem._id) {
      confirmed = confirm(`Deseja excluir o item "${menuItem.name}"?`);
    }

    if (confirmed) {
      try {
        if (menuItem._id) {
          await deleteMenuItem(store, menuSection.index, menuItem);
        }

        setMenuSection({
          ...menuSection,
          items: menuSection.items.filter((f) => f._id !== menuItem._id),
        });
      } catch (err: any) {
        toast(defaultToastError(err));
      }
    }
  }, [deleteMenuItem, menuItem, menuSection, setMenuSection, store, toast]);

  return editMode === "realistic" || !admin ? (
    <MenuItemRealistic
      menuItem={menuItem}
      useEffects={useEffects}
      onClick={() => {
        router.push(
          `/store/${store.slug}?orderItem=${menuItem._id}`,
          undefined,
          { shallow: true }
        );
      }}
      onEditClick={handleEditMenuItem}
      onDeleteClick={handleDeleteMenuItem}
    />
  ) : (
    <MenuItemEditFast
      menuItem={localMenuItem}
      onEditClick={handleEditMenuItem}
      onMenuItemChange={(newMenuItem) => {
        setLocalMenuItem(newMenuItem);
      }}
      onDeleteClick={handleDeleteMenuItem}
    />
  );
};

export default MenuItem;
