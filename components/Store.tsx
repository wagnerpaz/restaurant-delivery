import { FC, useCallback, useEffect, useRef, useState } from "react";
import { HiMenu } from "react-icons/hi";
import classNames from "classnames";
import cloneDeep from "lodash.clonedeep";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaSearch } from "react-icons/fa";
import { MdNoFood } from "react-icons/md";

import Menu from "/components/Menu/Menu";
import MenuSection from "/components/Menu/MenuSection";
import MenuItem from "/components/Menu/MenuItem";
import { ILocation, IMenuSection, IStore } from "/models/Store";
import EditMenuItemModal from "/forms/EditMenuItemForm";
import { IMenuItem } from "/models/MenuItem";
import useDeleteMenuItem from "/hooks/useDeleteMenuItem";
import { IIngredient } from "/models/Ingredients";
import { removeAt, replaceAt, swap } from "/lib/immutable";
import usePutMenuItem from "/hooks/usePutMenuItem";
import DraggableGroup from "/components/DraggableGroup";
import Draggable from "/components/Draggable";
import UserIcon from "/components/UserIcon";
import { IUser } from "/models/User";
import useSwapMenuItems from "/hooks/useSwapMenuItems";
import DbImage from "./DbImage";
import AddStoreModal from "/modals/AddStoreModal";
import usePutStore from "/hooks/usePutStore";
import { Button, Input, useToast } from "@chakra-ui/react";
import AddMenuSectionModal from "/modals/AddMenuSectionModal";
import usePutStoreMenuSectionSection from "/hooks/usePutStoreMenuSectionSections";
import usePutStoreMenuSection from "../hooks/usePutStoreMenuSection";
import useDeleteStoreMenuSection from "/hooks/useDeleteStoreMenuSection";
import Image from "next/image";
import Link from "next/link";
import searchIncludes from "../lib/searchIncludes";
import MainMenuDrawer from "./MainMenuDrawer";
import defaultToastError from "/config/defaultToastError";
import OrderMenuItemDetailsModal from "/modals/OrderMenuItemDetails";

interface StoreProps {
  store: IStore;
  onStoreChange: (value: IStore) => void;
  ingredients: IIngredient[];
  selectedLocation: ILocation;
}

const emptyMenuItem: IMenuItem = {
  name: "",
  price: 0,
  details: {},
  images: {},
  composition: [],
};

const emptyMenuSection: IMenuSection = {
  name: "",
  items: [],
  sections: [],
};

const Store: FC<StoreProps> = ({ store, selectedLocation, ingredients }) => {
  const toast = useToast();

  const searchMobileRef = useRef<HTMLInputElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSearchMobileInScreen, setIsSearchMobileInScreen] = useState(false);

  const [clientStore, setClientStore] = useState(store);
  const [clientIngredients, setClientIngredients] = useState(ingredients);
  const clientLocation = selectedLocation || clientStore?.locations?.[0];

  const [search, setSearch] = useState("");
  const [searchMobileVisible, setSearchMobileVisible] = useState(false);

  const [editMenuItemModalOpen, setEditMenuItemModalOpen] = useState(false);
  const [editMenuItemIndex, setEditMenuItemIndex] = useState(-1);
  const [editMenuItemObject, setEditMenuItemObject] = useState({
    ...emptyMenuItem,
  } as IMenuItem);
  const [editMenuSectionIndex, setEditMenuSectionIndex] = useState([-1]);

  const [editNewSectionIndex, setEditNewSectionIndex] = useState([-1]);
  const [editNewSectionModalOpen, setEditNewSectionModalOpen] = useState(false);
  const [editNewSectionParentName, setEditNewSectionParentName] = useState("");
  const [editNewSectionObject, setEditNewSectionObject] = useState({
    ...emptyMenuSection,
  });
  const [editNewSectionMode, setEditNewSectionMode] = useState("");

  const [addStoreModalOpen, setAddStoreModalOpen] = useState(!clientStore);

  const [orderMenuItemDetailsOpen, setOrderMenuItemDetailsOpen] =
    useState(false);
  const [orderMenuItemDetailObject, setOrderMenuItemDetailObject] = useState<
    IMenuItem | undefined
  >();

  const hasModalOpen =
    addStoreModalOpen ||
    editMenuItemModalOpen ||
    editNewSectionModalOpen ||
    orderMenuItemDetailsOpen;

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const AdminDraggableGroup = admin
    ? DraggableGroup
    : ({ children }: { children: React.ReactNode }) => children;
  const AdminDraggable = admin
    ? Draggable
    : ({ children }: { children: React.ReactNode }) => children;

  const putStore = usePutStore();
  const putMenuItem = usePutMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const deleteMenuSection = useDeleteStoreMenuSection();
  const putMenuSection = usePutStoreMenuSection();
  const putMenuSectionSection = usePutStoreMenuSectionSection();
  const swapMenuItems = useSwapMenuItems();

  useEffect(() => {
    if (searchMobileVisible) {
      searchMobileRef.current?.focus();
    }
  }, [searchMobileVisible]);

  useEffect(() => {
    const cachedRef = searchMobileRef.current,
      observer = new IntersectionObserver(
        ([e]) => setIsSearchMobileInScreen(e.intersectionRatio >= 1),
        { threshold: [1] }
      );

    if (cachedRef) {
      observer.observe(cachedRef);

      // unmount
      return function () {
        observer.unobserve(cachedRef);
      };
    }
  }, [searchMobileVisible]);

  const closeModals = () => {
    setAddStoreModalOpen(false);
    setEditMenuItemModalOpen(false);
    setEditNewSectionModalOpen(false);
    setOrderMenuItemDetailsOpen(false);
  };

  const onFindMenuItem = useCallback(
    (sectionIndex: number[]) => (id: string) => {
      const store = clientStore;
      let section = store.menu as IMenuSection;
      for (const index of sectionIndex) {
        section = section.sections[index];
      }
      const menuItems = section.items;
      const index = menuItems.findIndex((f) => f._id === id);
      return {
        menuItem: menuItems[index],
        index,
      };
    },
    [clientStore]
  );

  const onDropMenuItem = useCallback(
    (sectionIndex: number[]) => async (id: string, atIndex: number) => {
      const { index, menuItem } = onFindMenuItem(sectionIndex)(id);
      const cloneStore = cloneDeep(clientStore);
      let section = cloneStore.menu as IMenuSection;
      for (const index of sectionIndex) {
        section = section.sections[index];
      }

      swapMenuItems(clientStore, sectionIndex, [menuItem._id, atIndex]);
      section.items = swap(section.items, index, atIndex);
      setClientStore(cloneStore);
    },
    [clientStore, onFindMenuItem, swapMenuItems]
  );

  const foundItemsCount = useRef(0);

  const renderMenuSections = (
    sections: IMenuSection[] = [],
    path: IMenuSection[] = [],
    indexPath: number[] = []
  ): React.ReactNode => {
    return sections.map((section, sectionIndex) => {
      const sectionName = [path.map((p) => p.name).join(" • "), section.name]
        .filter((f) => f)
        .join(" • ");

      const foundItems = section.items.filter(
        (f) =>
          search.length < 3 ||
          searchIncludes(f.name, search) ||
          searchIncludes(f.nameDetail, search) ||
          searchIncludes(f.details?.short, search)
      );
      foundItemsCount.current += foundItems.length;

      return (
        <>
          {(foundItems.length > 0 || admin) && (
            <>
              <a
                id={"menu-section-" + [...indexPath, sectionIndex].join("-")}
                className="relative -top-[80px]"
              />
              <MenuSection
                key={section.name}
                name={sectionName}
                length={foundItems.length}
                totalLength={section.items?.length || 0}
                onAddMenuItemClick={() => {
                  setEditMenuItemObject({ ...emptyMenuItem } as IMenuItem);
                  setEditMenuItemIndex(-1);
                  setEditMenuSectionIndex([...indexPath, sectionIndex]);
                  setEditMenuItemModalOpen(true);
                }}
                onAddSectionClick={() => {
                  setEditNewSectionIndex([...indexPath, sectionIndex]);
                  setEditNewSectionModalOpen(true);
                  setEditNewSectionParentName(sectionName);
                  setEditNewSectionObject({ ...emptyMenuSection });
                  setEditNewSectionMode("ADD");
                }}
                onEditSectionClick={() => {
                  setEditNewSectionIndex([...indexPath, sectionIndex]);
                  setEditNewSectionModalOpen(true);
                  setEditNewSectionParentName(sectionName);
                  setEditNewSectionObject(section);
                  setEditNewSectionMode("EDIT");
                }}
              >
                <AdminDraggableGroup className="contents" editable={admin}>
                  {foundItems
                    .filter((f) => admin || !f.hidden)
                    .map((menuItem, menuItemIndex) => (
                      <AdminDraggable
                        containerClassName="h-full"
                        key={menuItem._id}
                        id={menuItem._id}
                        originalIndex={menuItemIndex}
                        onFind={onFindMenuItem([...indexPath, sectionIndex])}
                        onDrop={onDropMenuItem([...indexPath, sectionIndex])}
                      >
                        <MenuItem
                          name={menuItem.name}
                          nameDetail={menuItem.nameDetail}
                          id={menuItem._id}
                          mainImageId={menuItem.images?.main?.toString()}
                          price={menuItem.price}
                          pricePromotional={menuItem.pricePromotional}
                          hidden={menuItem.hidden}
                          descriptionShort={menuItem.details?.short}
                          composition={menuItem.composition}
                          sides={menuItem.sides}
                          index={menuItemIndex}
                          editable={admin}
                          useEffects
                          search={search}
                          onClick={() => {
                            setOrderMenuItemDetailsOpen(true);
                            setOrderMenuItemDetailObject(menuItem);
                          }}
                          onEditClick={() => {
                            setEditMenuItemObject({ ...menuItem } as IMenuItem);
                            setEditMenuItemIndex(menuItemIndex);
                            setEditMenuSectionIndex([
                              ...indexPath,
                              sectionIndex,
                            ]);
                            setEditMenuItemModalOpen(true);
                          }}
                          onDeleteClick={async () => {
                            const confirmed = confirm(
                              `Deseja excluir o item "${menuItem.name}"?`
                            );
                            if (confirmed) {
                              try {
                                await deleteMenuItem(
                                  clientStore,
                                  [...indexPath, sectionIndex],
                                  menuItem
                                );
                                const cloneStore = cloneDeep(clientStore);
                                const section =
                                  cloneStore.menu.sections[sectionIndex];
                                section.items = section.items.filter(
                                  (f) => f._id !== menuItem._id
                                );
                                setClientStore(cloneStore);
                              } catch (err: any) {
                                toast(defaultToastError(err));
                              }
                            }
                          }}
                        />
                      </AdminDraggable>
                    ))}
                </AdminDraggableGroup>
              </MenuSection>
            </>
          )}
          {renderMenuSections(
            section.sections || [],
            [...path, section],
            [...indexPath, sectionIndex]
          )}
        </>
      );
    });
  };

  return (
    <div
      className={classNames("font-lato custom-scrollbar min-h-screen pb-40", {
        "fixed top-0 left-0 w-full h-full overflow-hidden":
          editMenuItemModalOpen ||
          addStoreModalOpen ||
          orderMenuItemDetailsOpen,
      })}
    >
      <header className="bg-hero text-hero-a11y-high h-[var(--header-height)] sticky top-0 shadow-lg z-20 flex flex-row items-center w-full">
        <div className="flex flex-row items-center gap-2 px-3 sm:px-6 w-full">
          <DbImage
            className="rounded-md w-[50px] h-[50px]"
            id={clientStore?.logo}
            alt={`${clientStore?.name} logo`}
            width={50}
            height={50}
          />
          <div className="flex-1 overflow-hidden hidden sm:block">
            <h1 className="hidden md:block font-bold text-xl">
              {clientStore?.name || "Nome da sua loja"}
            </h1>
            <address className="hidden md:block text-sm text-hero-a11y-medium overflow-hidden w-full text-ellipsis whitespace-nowrap">
              <span className="font-bold mr-2 text-hero-a11y-high">
                {clientLocation?.city || "[Cidade]"} -{" "}
                {clientLocation?.state || "[ES]"}
              </span>
              <span>
                {clientLocation?.address || "[Endereço]"}{" "}
                {clientLocation?.number || "[Número]"},{" "}
                {clientLocation?.neighborhood || "[Bairro]"},{" "}
                {clientLocation?.postalCode || "[CEP]"}
              </span>
            </address>
          </div>
          <div className="flex-1" />
          <Input
            id="search"
            className="!w-full !min-w-0 max-w-xs !bg-main-100 !text-main-a11y-high hidden sm:block"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Pesquisar..."
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearch("");
              }
            }}
          ></Input>
          <Button
            className="sm:!hidden !px-0"
            variant="text"
            onClick={() => {
              if (hasModalOpen) {
                setSearchMobileVisible(true);
                searchMobileRef.current?.focus();
                closeModals();
              } else {
                if (searchMobileVisible) {
                  if (!isSearchMobileInScreen) {
                    searchMobileRef.current?.focus();
                  } else {
                    setSearchMobileVisible(false);
                  }
                } else {
                  setSearchMobileVisible(true);
                }
              }
            }}
          >
            <FaSearch size={22} />
          </Button>
          <Button
            className="flex flex-row gap-2 items-center !px-0  "
            variant="text"
            onClick={() => setDrawerOpen(true)}
          >
            <HiMenu size={36} />
          </Button>
          <UserIcon />
        </div>
      </header>
      {searchMobileVisible && (
        <Input
          ref={searchMobileRef}
          id="search-mobile"
          className="!w-full !min-w-0 !bg-main-100 !text-main-a11y-high !rounded-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar..."
        ></Input>
      )}
      <main>
        {(foundItemsCount.current = 0) || ""}
        <Menu>{renderMenuSections(clientStore?.menu?.sections)}</Menu>
        {foundItemsCount.current === 0 && !admin && (
          <span className="text-xl w-full h-[calc(100vh-var(--footer-height)-var(--header-height))] flex flex-col items-center justify-center gap-4">
            <MdNoFood size={42} />
            Ops... nenhum produto encontrado!
          </span>
        )}
        {admin && (
          <MenuSection
            isNew
            onAddSectionClick={() => {
              setEditNewSectionModalOpen(true);
              setEditNewSectionIndex([-1]);
              setEditNewSectionParentName("");
              setEditNewSectionMode("ADD");
            }}
          />
        )}
      </main>
      <footer className="bg-comanda-hero p-6 absolute h-[var(--footer-height)] bottom-0 w-full flex flex-row items-center">
        <Link href="/">
          <Image
            className="w-[200px]"
            src="/logo.png"
            width={99999}
            height={99999}
            alt="Rappid logo"
          />
        </Link>
      </footer>
      <MainMenuDrawer
        store={clientStore}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <EditMenuItemModal
        open={editMenuItemModalOpen}
        onOpenChange={(newValue) => setEditMenuItemModalOpen(newValue)}
        store={clientStore}
        ingredients={clientIngredients}
        menuItem={editMenuItemObject}
        onStoreChange={(newStore) => setClientStore(newStore)}
        onIngredientsChange={(newIngredients) => {
          setClientIngredients(newIngredients);
        }}
        onMenuItemChange={async (newMenuItem?: IMenuItem, cancelled?) => {
          if (cancelled) {
            return;
          }

          try {
            const serverMenuItem = await putMenuItem(
              clientStore,
              newMenuItem,
              editMenuSectionIndex
            );

            const cloneStore = cloneDeep(clientStore);
            const menu = cloneStore.menu;

            let curSection = menu as IMenuSection;
            for (const index of editMenuSectionIndex) {
              curSection = curSection.sections[index];
            }
            curSection.items = replaceAt(
              curSection.items,
              editMenuItemIndex >= 0
                ? editMenuItemIndex
                : curSection.items.length,
              serverMenuItem
            );

            setClientStore(cloneStore);

            setEditMenuItemObject({ ...emptyMenuItem });
            setEditMenuItemIndex(-1);
            setEditMenuSectionIndex([-1]);
            setEditMenuItemModalOpen(false);
          } catch (err: any) {
            toast(defaultToastError(err));
          }
        }}
      />
      {orderMenuItemDetailsOpen && orderMenuItemDetailObject && (
        <OrderMenuItemDetailsModal
          portalTarget={() => document.body}
          menuItem={orderMenuItemDetailObject}
          open={orderMenuItemDetailsOpen}
          onOpenChange={(value) => setOrderMenuItemDetailsOpen(value)}
        />
      )}
      {addStoreModalOpen && (
        <AddStoreModal
          store={clientStore}
          onStoreChange={async (value, shouldSave) => {
            if (shouldSave) {
              try {
                const serverStore = await putStore(value);
                setClientStore(serverStore);
                setAddStoreModalOpen(false);
              } catch (err: any) {
                toast(defaultToastError(err));
              }
            } else {
              setClientStore(value);
            }
          }}
          portalTarget={() => null}
          noAutoClose
          open={addStoreModalOpen}
          onOpenChange={(value) => setAddStoreModalOpen(value)}
        />
      )}
      {editNewSectionModalOpen && (
        <AddMenuSectionModal
          portalTarget={() => null}
          noAutoClose
          mode={editNewSectionMode}
          parentName={editNewSectionParentName}
          menuSection={editNewSectionObject}
          open={editNewSectionModalOpen}
          onOpenChange={(value) => setEditNewSectionModalOpen(value)}
          onSave={async (value) => {
            try {
              if (editNewSectionMode === "EDIT") {
                await putMenuSection(clientStore, value, editNewSectionIndex);
              } else {
                if (editNewSectionIndex[0] >= 0) {
                  await putMenuSectionSection(
                    clientStore,
                    editNewSectionIndex,
                    value
                  );
                } else {
                  await putMenuSection(clientStore, value);
                }
              }

              const cloneStore = cloneDeep(clientStore);

              let sections;
              let section = cloneStore.menu as IMenuSection;
              if (editNewSectionMode === "ADD") {
                if (editNewSectionIndex[0] >= 0) {
                  for (const index of editNewSectionIndex) {
                    section = section.sections[index];
                  }
                  sections = section.sections;
                  sections.push(value);
                } else {
                  sections = cloneStore.menu.sections;
                  sections.push(value);
                }
              } else {
                if (editNewSectionIndex[0] >= 0) {
                  for (const index of editNewSectionIndex) {
                    section = section.sections[index];
                  }
                } else {
                  section = section.sections[0];
                }
                console.log(section, value);
                Object.assign(section, value);
              }

              setClientStore(cloneStore);
            } catch (err: any) {
              toast(defaultToastError(err));
            }

            setEditNewSectionModalOpen(false);
            setEditNewSectionIndex([-1]);
            setEditNewSectionParentName("");
          }}
          onCancel={() => {
            setEditNewSectionModalOpen(false);
            setEditNewSectionIndex([-1]);
            setEditNewSectionParentName("");
          }}
          onDelete={async () => {
            const confirmed = confirm(
              `Você tem certeza que deseja remover a seção "${editNewSectionObject.name}" com todos os seus items?`
            );

            if (confirmed) {
              try {
                await deleteMenuSection(clientStore, editNewSectionIndex);

                const cloneStore = cloneDeep(clientStore);

                const indexSpliced = [...editNewSectionIndex];
                const lastIndex = indexSpliced.splice(-1)[0];

                let section = cloneStore.menu as IMenuSection;
                for (const index of indexSpliced) {
                  section = section.sections[index];
                }
                section.sections = removeAt(section.sections, lastIndex);

                setClientStore(cloneStore);

                setEditNewSectionModalOpen(false);
                setEditNewSectionIndex([-1]);
                setEditNewSectionParentName("");
              } catch (err: any) {
                toast(defaultToastError(err));
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default Store;
