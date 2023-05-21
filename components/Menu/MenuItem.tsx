import { useContext, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

import MenuItemRealistic from "/components/Menu/MenuItemRealistic";
import { IMenuItem } from "/models/types/MenuItem";
import { IUser } from "/models/types/User";
import { useRouter } from "next/router";
import { StoreContext } from "../Store";
import useDeleteMenuItem from "/hooks/useDeleteMenuItem";
import defaultToastError from "/config/defaultToastError";
import { MenuSectionContext } from "./MenuSection";
import useLocalState from "/hooks/useLocalState";
import useToast from "/hooks/useToast";

const MenuItemEditFast = dynamic(
  () => import("/components/Menu/MenuItemEditFast")
);

interface MenuItemProps {
  editMode: "realistic" | "fast";
  menuItem: IMenuItem;
  useEffects?: boolean;
  onMenuItemChange: (newMenuItem: IMenuItem) => void;
}

export const emptyMenuItem: IMenuItem = {
  itemType: "product",
  name: "",
  nameDetail: "",
  price: 0,
  details: { short: "" },
  images: {},
  composition: [],
  customizeType: "template",
};

export const TYPE_VALUES = (t) => ({
  product: t("menu.item.type.product"),
  ingredient: t("menu.item.type.ingredient"),
});

export const TYPE_OPTIONS = (t) => [
  {
    value: Object.keys(TYPE_VALUES(t))[0],
    label: Object.values(TYPE_VALUES(t))[0],
  },
  {
    value: Object.keys(TYPE_VALUES(t))[1],
    label: Object.values(TYPE_VALUES(t))[1],
  },
];

const MenuItem: React.FC<MenuItemProps> = ({
  editMode,
  menuItem,
  useEffects,
}) => {
  const { t } = useTranslation();

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const { store } = useContext(StoreContext);
  const { menuSection, setMenuSection } = useContext(MenuSectionContext);

  const toast = useToast();
  const router = useRouter();

  const [localMenuItem, setLocalMenuItem] = useLocalState(menuItem);

  const deleteMenuItem = useDeleteMenuItem();

  const handleEditMenuItem = useCallback(() => {
    router.push(
      `/store/${store.slug}?editMenuItemId=${menuItem._id}`,
      undefined,
      { shallow: true }
    );
  }, [menuItem._id, router, store.slug]);

  const handleDeleteMenuItem = useCallback(async () => {
    if (menuItem._id.startsWith("_tmp_")) {
      setMenuSection({
        ...menuSection,
        items: menuSection.items.filter((f) => f._id !== menuItem._id),
      });
      return;
    }

    let confirmed = true;
    if (menuItem._id) {
      confirmed = confirm(
        t("menu.item.remove.confirm", { menuItem: menuItem.name })
      );
    }

    if (confirmed) {
      try {
        if (menuItem._id) {
          await deleteMenuItem(store, menuSection, menuItem);
        }

        setMenuSection({
          ...menuSection,
          items: menuSection.items.filter((f) => f._id !== menuItem._id),
        });
        toast({
          message: t("menu.item.remove.sucess.message"),
          description: t("menu.item.remove.sucess.description", {
            menuItem: menuItem.name,
          }),
          type: "success",
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
