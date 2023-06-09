import { useMemo, useCallback, useContext, createContext, memo } from "react";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { HiPlus } from "react-icons/hi";
import { AccordionItem, AccordionItemPanel } from "react-accessible-accordion";
import { v4 as uuidv4 } from "uuid";
import isEqual from "fast-deep-equal";
import dynamic from "next/dynamic";

import MenuSectionHeader from "/components/Menu/MenuSectionHeader";
import { IUser } from "/models/types/User";
import { IMenuItem } from "/models/types/MenuItem";
import DraggableGroup from "../DraggableGroup";
import Draggable from "../Draggable";
import { moveTo } from "/lib/immutable";
import MenuItem, { emptyMenuItem } from "./MenuItem";
import { IMenuSection } from "/models/types/MenuSection";
import useLocalState from "/hooks/useLocalState";
import { StoreContext } from "../Store";
import useReorderMenuItems from "/hooks/useReorderMenuItems";
import defaultToastError from "/config/defaultToastError";
import useGoBackToRoot from "/hooks/useGoBackToRoot";
import useToast from "/hooks/useToast";

const EditMenuItemModal = dynamic(() => import("/modals/EditMenuItemModal"));

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
};

interface MenuSectionProps {
  className?: string;
  menuSection: IMenuSection;
  type: "product" | "ingredient";
  expanded?: boolean;
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
  },
  setMenuSection: () => {},
});

const MenuSection: React.FC<MenuSectionProps> = ({
  className,
  type,
  menuSection,
  expanded,
  isNew,
  onChangeItems = () => {},
  onAddMenuItemClick,
  onAddSectionClick,
  onEditSectionClick,
  onTrashClick,
  onFastEditClick,
  ...props
}) => {
  const { store, allFoundItems } = useContext(StoreContext);
  const router = useRouter();

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const [localMenuSection, setLocalMenuSection] = useLocalState(menuSection);

  const reorderMenuItems = useReorderMenuItems();

  const editMenuItemObject = useMemo(() => {
    if (router.query.editMenuItemId) {
      return localMenuSection.items.find(
        (f) => f._id === router.query.editMenuItemId
      );
    } else if (router.query.addMenuItemBySection) {
      return {
        ...emptyMenuItem,
        itemType: "product",
      };
    }
  }, [
    localMenuSection.items,
    router.query.addMenuItemBySection,
    router.query.editMenuItemId,
  ]);

  const toast = useToast();
  const goBackToRoot = useGoBackToRoot();

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
      try {
        reorderMenuItems(store, localMenuSection._id, [id, `${atIndex}`]);
        setLocalMenuSection({
          ...localMenuSection,
          items: moveTo(localMenuSection.items, index, atIndex),
        });
      } catch (err) {
        toast(defaultToastError(err));
      }
    },
    [
      onFindMenuItem,
      reorderMenuItems,
      store,
      localMenuSection,
      setLocalMenuSection,
      toast,
    ]
  );

  const handleAddMenuItemRealistic = () => {
    router.push(
      `/store/${store.slug}?addMenuItemBySection=${menuSection._id}`,
      undefined,
      { shallow: true }
    );
  };

  const handleAddMenuItemFast = useCallback(() => {
    setLocalMenuSection({
      ...localMenuSection,
      items: [
        ...localMenuSection.items,
        { ...emptyMenuItem, _id: `_tmp_${uuidv4()}`, itemType: type },
      ],
    });
  }, [localMenuSection, setLocalMenuSection, type]);

  const handleAddMenuItem = () => {
    if (editModeByType === "realistic") {
      handleAddMenuItemRealistic();
    } else if (editModeByType === "fast") {
      handleAddMenuItemFast();
    }
  };

  const menuItemsByType = useMemo(
    () => localMenuSection.items.filter((f) => f.itemType === type),
    [localMenuSection.items, type]
  );

  const foundItems = useMemo(
    () =>
      menuItemsByType.filter((f) => allFoundItems.find((d) => f._id === d._id)),
    [allFoundItems, menuItemsByType]
  );

  const editModeByType =
    type === "ingredient"
      ? localMenuSection.editModeIngredient
      : localMenuSection.editModeProduct;

  return (
    <MenuSectionContext.Provider
      value={{
        menuSection: localMenuSection,
        setMenuSection: setLocalMenuSection,
      }}
    >
      {(foundItems.length > 0 || admin) && (
        <AccordionItem className="!border-t-0" uuid={menuSection._id}>
          <div
            id={"menu-section-" + menuSection._id}
            className="relative -top-[80px]"
          />
          <MenuSectionHeader
            name={localMenuSection.name}
            length={foundItems.length}
            totalLength={menuItemsByType.length}
            expanded={expanded}
            isNew={isNew}
            type={type}
            editMode={editModeByType}
            onAddMenuItemClick={handleAddMenuItem}
            onAddSectionClick={onAddSectionClick}
            onEditSectionClick={onEditSectionClick}
            onTrashClick={onTrashClick}
          />
          {localMenuSection.items.length > 0 && (
            <AccordionItemPanel
              id={`${menuSection._id}-${type}`}
              className={classNames(
                "sm:container sm:m-auto !px-2 sm:!px-8",
                {
                  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6":
                    editModeByType === "realistic" || !admin,
                  "flex flex-col gap-2": editModeByType === "fast" && admin,
                },
                { "my-2 sm:my-6": true },
                { hidden: !expanded },
                className
              )}
              {...props}
            >
              <DraggableGroup
                id={`accordion__panel-${menuSection._id}-${type}`}
                className="contents"
              >
                {foundItems.map((menuItem, menuItemIndex) => (
                  <Draggable
                    dragIndicator={editModeByType === "fast" && admin}
                    disabled={menuItem._id.startsWith("_tmp_")}
                    containerClassName="h-full"
                    key={menuItem._id}
                    id={menuItem._id}
                    originalIndex={menuItemIndex}
                    onFind={onFindMenuItem}
                    onDrop={onDropMenuItem}
                  >
                    <MenuItem
                      editMode={editModeByType}
                      menuItem={menuItem}
                      useEffects
                    />
                  </Draggable>
                ))}
                {admin && (
                  <div
                    className={classNames(
                      "flex items-center justify-center w-full h-full bg-contrast-high shadow-md rounded-md border border-main-a11y-low cursor-pointer",
                      {
                        "min-h-[428px]": editModeByType === "realistic",
                        "ml-6 !w-[calc(100%-1.5rem)]":
                          editModeByType === "fast",
                      }
                    )}
                    onClick={handleAddMenuItem}
                  >
                    <HiPlus
                      className={classNames("", {
                        "w-20 h-20 p-5 ": editModeByType === "realistic",
                        "w-10 h-10 p-1 ": editModeByType === "fast",
                      })}
                    />
                  </div>
                )}
              </DraggableGroup>
            </AccordionItemPanel>
          )}
        </AccordionItem>
      )}
      {editMenuItemObject && (
        <EditMenuItemModal
          open={
            !!router.query.editMenuItemId || !!router.query.addMenuItemBySection
          }
          onOpenChange={goBackToRoot}
          menuItem={editMenuItemObject}
        />
      )}
    </MenuSectionContext.Provider>
  );
};

export default memo(
  MenuSection,
  (prev, next) =>
    isEqual(prev.menuSection, next.menuSection) &&
    prev.isNew === next.isNew &&
    prev.expanded === next.expanded
);
