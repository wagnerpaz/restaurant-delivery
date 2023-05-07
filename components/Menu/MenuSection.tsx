import {
  useMemo,
  useCallback,
  useContext,
  createContext,
  useEffect,
  memo,
} from "react";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { HiPlus } from "react-icons/hi";
import { AccordionItem, AccordionItemPanel } from "react-accessible-accordion";
import { useToast } from "@chakra-ui/react";

import MenuSectionHeader from "/components/Menu/MenuSectionHeader";
import { IUser } from "/models/types/User";
import { IMenuItem } from "/models/types/MenuItem";
import DraggableGroup, { DraggableGroupProps } from "../DraggableGroup";
import Draggable, { DraggableProps } from "../Draggable";
import { moveTo } from "/lib/immutable";
import MenuItem, { emptyMenuItem } from "./MenuItem";
import { IMenuSection } from "/models/types/Store";
import useLocalState from "/hooks/useLocalState";
import { StoreContext } from "../Store";
import useReorderMenuItems from "/hooks/useReorderMenuItems";
import looseSearch from "/lib/looseSearch";

export const GRID_CONFIG = {
  xs: { cols: 1, gap: 1 },
  sm: { cols: 2, gap: 1.5 },
  md: { cols: 2, gap: 1.5 },
  lg: { cols: 3, gap: 1.5 },
  xl: { cols: 3, gap: 1.5 },
  "2xl": { cols: 4, gap: 1.5 },
  marginX: 2,
};

export const emptyMenuSection: IMenuSection = {
  name: "",
  items: [],
  sections: [],
};

interface MenuSectionProps extends AccordionPanelProps {
  menuSection: IMenuSection;
  type: "product" | "ingredient";
  isNew?: boolean;
  onChangeItems: (items: IMenuItem[]) => void;
  onAddMenuItemClick?: () => void;
  onAddSectionClick?: () => void;
  onEditSectionClick?: () => void;
  onTrashClick?: () => void;
  onFastEditClick?: () => void;
}

export const MenuSectionContext = createContext<{
  menuSection: IMenuSection;
  setMenuSection: (menuSection: IMenuSection) => void;
}>({
  menuSection: {
    name: "",
    index: [],
    editMode: "realistic",
    items: [],
    sections: [],
  },
  setMenuSection: () => {},
});

const MenuSection: React.FC<MenuSectionProps> = ({
  className,
  type,
  menuSection,
  isNew,
  onChangeItems = () => {},
  onAddMenuItemClick,
  onAddSectionClick,
  onEditSectionClick,
  onTrashClick,
  onFastEditClick,
  ...props
}) => {
  const { store, search } = useContext(StoreContext);
  const router = useRouter();
  const toast = useToast();

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const [localMenuSection, setLocalMenuSection] = useLocalState(menuSection);

  const reorderMenuItems = useReorderMenuItems();

  const AdminDraggableGroup: React.FC<DraggableGroupProps> = useMemo(() => {
    return admin
      ? DraggableGroup
      : ({ children }: DraggableGroupProps) => <>{children}</>;
  }, [admin]);

  const AdminDraggable: React.FC<DraggableProps> = useMemo(
    () =>
      admin ? Draggable : ({ children }: DraggableProps) => <>{children}</>,
    [admin]
  );

  useEffect(() => {}, []);

  const onFindMenuItem = useCallback(
    (id: string) => {
      const index = localMenuSection.items.findIndex((f) => f._id === id);
      return {
        menuItem: localMenuSection.items[index],
        index,
      };
    },
    [localMenuSection.items]
  );

  const onDropMenuItem = useCallback(
    async (id: string, atIndex: number) => {
      const { index } = onFindMenuItem(id);
      reorderMenuItems(store, menuSection.index, [id, `${atIndex}`]);
      setLocalMenuSection({
        ...menuSection,
        items: moveTo(localMenuSection.items, index, atIndex),
      });
    },
    [
      onFindMenuItem,
      reorderMenuItems,
      store,
      menuSection,
      setLocalMenuSection,
      localMenuSection.items,
    ]
  );

  const handleAddMenuItem = () => {
    router.push(
      `/store/${store.slug}?addMenuItemBySection=${menuSection.index}`,
      undefined,
      { shallow: true }
    );
  };

  const handleAddMenuItemFast = useCallback(() => {
    if (localMenuSection.items.find((f) => !f._id)) {
      toast({
        title: "Salve todos os novos itens antes de adicionar outro.",
        status: "warning",
      });
    } else {
      setLocalMenuSection({
        ...localMenuSection,
        items: [
          ...localMenuSection.items,
          { ...emptyMenuItem, itemType: "ingredient" },
        ],
      });
    }
  }, [localMenuSection, setLocalMenuSection, toast]);

  const foundItems = localMenuSection.items
    .filter((f) => f.itemType === type)
    .filter(
      (f) =>
        looseSearch(f.name, search) ||
        looseSearch(f.nameDetail || "", search) ||
        looseSearch(f.details?.short || "", search)
    );

  return (
    <MenuSectionContext.Provider
      value={{
        menuSection: localMenuSection,
        setMenuSection: setLocalMenuSection,
      }}
    >
      {foundItems.length > 0 && (
        <AccordionItem className="!border-t-0" uuid={menuSection._id}>
          <div
            id={"menu-section-" + menuSection._id}
            className="relative -top-[80px]"
          />
          <MenuSectionHeader
            name={localMenuSection.name}
            length={foundItems.length}
            totalLength={localMenuSection.items.length}
            isNew={isNew}
            editMode={localMenuSection.editMode}
            onAddMenuItemClick={onAddMenuItemClick}
            onAddSectionClick={onAddSectionClick}
            onEditSectionClick={onEditSectionClick}
            onTrashClick={onTrashClick}
            onFastEditClick={onFastEditClick}
          />
          <AccordionItemPanel
            className={classNames(
              "sm:container sm:m-auto !px-2 sm:!px-8",
              {
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6":
                  menuSection.editMode === "realistic" || !admin,
                "flex flex-col gap-2": menuSection.editMode === "fast" && admin,
              },
              { "my-2 sm:my-6": true },
              className
            )}
            {...props}
          >
            <AdminDraggableGroup className="contents">
              {foundItems.map((menuItem, menuItemIndex) => (
                <AdminDraggable
                  dragIndicator={menuSection.editMode === "fast" && admin}
                  containerClassName="h-full"
                  key={menuItem._id}
                  id={menuItem._id}
                  originalIndex={menuItemIndex}
                  onFind={onFindMenuItem}
                  onDrop={onDropMenuItem}
                >
                  <MenuItem
                    editMode={menuSection.editMode}
                    menuItem={menuItem}
                    useEffects
                  />
                </AdminDraggable>
              ))}
              {admin && (
                <div
                  className={classNames(
                    "flex items-center justify-center w-full h-full bg-contrast-high shadow-md rounded-md border border-main-a11y-low cursor-pointer",
                    {
                      "min-h-[428px]": menuSection.editMode === "realistic",
                      "ml-6 w-[calc(100%-1.5rem)]":
                        menuSection.editMode === "fast",
                    }
                  )}
                >
                  <HiPlus
                    className={classNames("", {
                      "w-20 h-20 p-5 ": menuSection.editMode === "realistic",
                      "w-10 h-10 p-1 ": menuSection.editMode === "fast",
                    })}
                    onClick={() => {
                      if (menuSection.editMode === "realistic") {
                        handleAddMenuItem();
                      } else if (menuSection.editMode === "fast") {
                        handleAddMenuItemFast();
                      }
                    }}
                  />
                </div>
              )}
            </AdminDraggableGroup>
          </AccordionItemPanel>
        </AccordionItem>
      )}
    </MenuSectionContext.Provider>
  );
};

export default memo(
  MenuSection,
  (prev, next) =>
    prev.menuSection === next.menuSection && prev.isNew === next.isNew
);
