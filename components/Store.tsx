import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
} from "react";
import { HiMenu } from "react-icons/hi";
import classNames from "classnames";
import cloneDeep from "lodash.clonedeep";
import { useSession } from "next-auth/react";
import { FaSearch } from "react-icons/fa";

import Menu from "/components/Menu/Menu";
import MenuSection, { emptyMenuSection } from "/components/Menu/MenuSection";
import { ILocation, IMenuSection, IStore } from "/models/Store";
import EditMenuItemModal from "/forms/EditMenuItemForm";
import { IMenuItem } from "/models/MenuItem";
import useDeleteMenuItem from "/hooks/useDeleteMenuItem";
import { IIngredient } from "/models/Ingredients";
import { removeAt } from "/lib/immutable";
import usePutMenuItem from "/hooks/usePutMenuItem";
import UserIcon from "/components/UserIcon";
import { IUser } from "/models/User";
import useReorderMenuItems from "../hooks/useReorderMenuItems";
import AddStoreModal from "/modals/AddStoreModal";
import usePutStore from "/hooks/usePutStore";
import { Button, Input, useToast } from "@chakra-ui/react";
import AddMenuSectionModal from "/modals/AddMenuSectionModal";
import usePutStoreMenuSectionSection from "/hooks/usePutStoreMenuSectionSections";
import usePutStoreMenuSection from "../hooks/usePutStoreMenuSection";
import useDeleteStoreMenuSection from "/hooks/useDeleteStoreMenuSection";
import Image from "next/image";
import Link from "next/link";
import MainMenuDrawer from "./MainMenuDrawer";
import defaultToastError from "/config/defaultToastError";
import OrderMenuItemDetailsModal from "/modals/OrderMenuItemDetails";
import { useRouter } from "next/router";
import {
  findMenuItemSectionIndex,
  replaceObjectById,
  retriveAllMenuItems as retrieveAllMenuItems,
} from "/lib/menuSectionUtils";
import useGetStore from "/hooks/useGetStore";
import EditAddressModal from "/modals/EditAddressModal";
import usePutUser from "/hooks/usePutUser";
import EditMenuItemTrashModal from "/modals/EditMenuItemTrashModal";
import ImageWithFallback from "./ImageWithFallback";
import { emptyMenuItem } from "./Menu/MenuItem";
import DebouncedInput from "./DebouncedInput";

interface StoreProps {
  store: IStore;
  onStoreChange: (value: IStore, shouldSave: boolean) => void;
  ingredients: IIngredient[];
  selectedLocation: ILocation;
}

export const StoreContext = createContext<{
  store: IStore;
  setStore: (store: IStore) => void;
  search: string;
}>({
  store: {} as IStore,
  setStore: () => {},
  search: "",
});

const Store: FC<StoreProps> = ({ store, selectedLocation, ingredients }) => {
  const toast = useToast();
  const router = useRouter();

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const searchMobileRef = useRef<HTMLInputElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSearchMobileInScreen, setIsSearchMobileInScreen] = useState(false);

  const [clientUser, setClientUser] = useState<IUser>();
  const [clientStore, setClientStore] = useState(store);
  const [clientIngredients, setClientIngredients] = useState(ingredients);
  const clientLocation = selectedLocation || clientStore?.locations?.[0];

  const [search, setSearch] = useState("");
  const [searchMobileVisible, setSearchMobileVisible] = useState(false);

  const editMenuItemObject = useMemo(
    () =>
      retrieveAllMenuItems(clientStore?.menu?.sections || []).find(
        (f) => f._id === router.query.editMenuItemId
      ) ||
      (router.query.addMenuItemBySection && {
        ...emptyMenuItem,
        itemType: "product",
      }),
    [
      clientStore?.menu?.sections,
      router.query.editMenuItemId,
      router.query.addMenuItemBySection,
    ]
  );
  const editMenuItemModalOpen = !!router.query.editMenuItemId;

  const [editNewSectionIndex, setEditNewSectionIndex] = useState([-1]);
  const [editNewSectionModalOpen, setEditNewSectionModalOpen] = useState(false);
  const [editNewSectionParentName, setEditNewSectionParentName] = useState("");
  const [editNewSectionObject, setEditNewSectionObject] = useState({
    ...emptyMenuSection,
  });
  const [editNewSectionMode, setEditNewSectionMode] = useState("");

  const [addStoreModalOpen, setAddStoreModalOpen] = useState(!clientStore);

  const orderMenuItemDetailObject = useMemo(
    () =>
      retrieveAllMenuItems(clientStore?.menu?.sections || []).find(
        (f) => f._id === router.query.orderItem
      ),
    [clientStore?.menu?.sections, router.query.orderItem]
  );
  const orderMenuItemDetailsOpen = !!router.query.orderItem;

  const editUserAddressesObject = useMemo(
    () => clientUser?.locations,
    [clientUser]
  );
  const editUserAddressesOpen = !!router.query.addressesUserId;

  const restoreTrashForSectionIndexOpen =
    !!router.query.restoreTrashForSectionIndex;

  const hasModalOpen =
    addStoreModalOpen ||
    editMenuItemModalOpen ||
    editNewSectionModalOpen ||
    orderMenuItemDetailsOpen;

  const getStore = useGetStore();
  const putStore = usePutStore();
  const putMenuItem = usePutMenuItem();
  const deleteMenuSection = useDeleteStoreMenuSection();
  const putMenuSection = usePutStoreMenuSection();
  const putMenuSectionSection = usePutStoreMenuSectionSection();
  const putUser = usePutUser();
  const reorderMenuItems = useReorderMenuItems();

  useEffect(() => {
    if (searchMobileVisible) {
      searchMobileRef.current?.focus();
    }
  }, [searchMobileVisible]);

  useEffect(() => {
    setClientUser(session?.user as IUser);
  }, [session?.user]);

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
    setEditNewSectionModalOpen(false);
  };

  const foundItemsCount = useRef(0);

  const comeBackToStoreRoot = (newValue: boolean) => {
    if (!newValue) {
      router.push(`/store/${clientStore.slug}`, undefined, {
        shallow: true,
      });
    }
  };

  if (!clientStore?.listed && !admin) {
    return null;
  }

  return (
    <StoreContext.Provider
      value={{ store: clientStore, setStore: setClientStore, search }}
    >
      <div
        className={classNames("font-lato custom-scrollbar min-h-screen pb-40")}
      >
        <header className="bg-hero text-hero-a11y-high h-[var(--header-height)] sticky top-0 shadow-md z-20 flex flex-row items-center w-full">
          <div className="flex flex-row items-center gap-2 px-3 sm:px-6 w-full">
            <ImageWithFallback
              className="rounded-md w-[50px] h-[50px]"
              src={clientStore?.logo}
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
            <DebouncedInput
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
            ></DebouncedInput>
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
              className="flex flex-row gap-2 items-center !px-0"
              variant="text"
              onClick={() => setDrawerOpen(true)}
            >
              <HiMenu size={36} />
            </Button>
            <UserIcon store={clientStore} />
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
          <Menu
            sections={clientStore.menu.sections}
            onChangeSection={(section) => {
              const cloneStore = cloneDeep(clientStore);
              cloneStore.menu.sections = replaceObjectById(
                cloneStore.menu.sections,
                section._id,
                section
              );
              setClientStore(cloneStore);
            }}
          />
          {/* {foundItemsCount.current === 0 && !admin && (
            <span className="text-xl w-full h-[calc(100vh-var(--footer-height)-var(--header-height))] flex flex-col items-center justify-center gap-4">
              <MdNoFood size={42} />
              Ops... nenhum produto encontrado!
            </span>
          )} */}
          {/* {admin && (
            <Menu>
              <MenuSection
                isNew
                onAddSectionClick={() => {
                  setEditNewSectionObject({ ...emptyMenuSection });
                  setEditNewSectionModalOpen(true);
                  setEditNewSectionIndex([-1]);
                  setEditNewSectionParentName("");
                  setEditNewSectionMode("ADD");
                }}
              />
            </Menu>
          )} */}
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
          onStoreDataClick={() => {
            setAddStoreModalOpen(true);
            setDrawerOpen(false);
          }}
        />
        {editMenuItemObject && (
          <EditMenuItemModal
            open={
              !!router.query.editMenuItemId ||
              !!router.query.addMenuItemBySection
            }
            onOpenChange={comeBackToStoreRoot}
            store={clientStore}
            ingredients={clientIngredients}
            menuItem={editMenuItemObject}
            onStoreChange={async (newStore, shouldSave) => {
              setClientStore(newStore);
              if (shouldSave) {
                await putStore(newStore);
              }
            }}
            onIngredientsChange={(newIngredients) => {
              setClientIngredients(newIngredients);
            }}
            onMenuItemChange={async (newMenuItem?: IMenuItem, cancelled?) => {
              if (cancelled) {
                return;
              }

              let editMenuSectionIndex;
              if (newMenuItem?._id) {
                editMenuSectionIndex = findMenuItemSectionIndex(
                  clientStore.menu.sections,
                  newMenuItem
                );
              } else {
                editMenuSectionIndex =
                  `${router.query.addMenuItemBySection}`?.split(",");
              }

              try {
                await putMenuItem(
                  clientStore,
                  newMenuItem,
                  editMenuSectionIndex
                );
                const updatedStore = await getStore(clientStore._id);
                setClientStore(updatedStore);
                comeBackToStoreRoot(false);
              } catch (err: any) {
                toast(defaultToastError(err));
              }
            }}
          />
        )}
        {orderMenuItemDetailsOpen && orderMenuItemDetailObject && (
          <OrderMenuItemDetailsModal
            store={clientStore}
            portalTarget={() => document.body}
            menuItem={orderMenuItemDetailObject}
            open={orderMenuItemDetailsOpen}
            onOpenChange={comeBackToStoreRoot}
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
            noAutoClose={!clientStore}
            open={addStoreModalOpen}
            onOpenChange={(value) => setAddStoreModalOpen(value)}
          />
        )}
        {editNewSectionModalOpen && (
          <AddMenuSectionModal
            portalTarget={() => null}
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
                if (
                  editNewSectionMode === "ADD" ||
                  editNewSectionMode === "ADD-SUB"
                ) {
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
        {editUserAddressesOpen && (
          <EditAddressModal
            open={editUserAddressesOpen}
            locations={editUserAddressesObject}
            onOpenChange={comeBackToStoreRoot}
            onLocationsChange={async (locations) => {
              const serverUser = await putUser({
                ...clientUser,
                locations,
              } as IUser);
              setClientUser(serverUser);
              comeBackToStoreRoot(false);
            }}
          />
        )}
        {restoreTrashForSectionIndexOpen && (
          <EditMenuItemTrashModal
            open={restoreTrashForSectionIndexOpen}
            onOpenChange={comeBackToStoreRoot}
            store={clientStore}
          />
        )}
      </div>
    </StoreContext.Provider>
  );
};

export default Store;
