import {
  FC,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
} from "react";
import classNames from "classnames";
import cloneDeep from "lodash.clonedeep";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import Menu from "/components/Menu/Menu";
import { emptyMenuSection } from "/components/Menu/MenuSection";
import { ILocation, IMenuSection, IStore } from "/models/types/Store";

import { IMenuItem } from "/models/types/MenuItem";
import { removeAt } from "/lib/immutable";
import usePutMenuItem from "/hooks/usePutMenuItem";
import { IUser } from "/models/types/User";
import usePutStore from "/hooks/usePutStore";
import usePutStoreMenuSectionSection from "/hooks/usePutStoreMenuSectionSections";
import usePutStoreMenuSection from "../hooks/usePutStoreMenuSection";
import useDeleteStoreMenuSection from "/hooks/useDeleteStoreMenuSection";
import defaultToastError from "/config/defaultToastError";
import {
  findMenuItemSectionIndex,
  replaceObjectById,
  retriveAllMenuItems as retrieveAllMenuItems,
} from "/lib/menuSectionUtils";
import useGetStore from "/hooks/useGetStore";
import usePutUser from "/hooks/usePutUser";
import { emptyMenuItem } from "./Menu/MenuItem";
import StoreHeader from "./StoreHeader";
import { MdNoFood } from "react-icons/md";

const EditAddressModal = dynamic(() => import("/modals/EditAddressModal"), {
  ssr: false,
});
const EditMenuItemTrashModal = dynamic(
  () => import("/modals/EditMenuItemTrashModal"),
  { ssr: false }
);
const EditMenuItemModal = dynamic(() => import("/forms/EditMenuItemForm"), {
  ssr: false,
});
const OrderMenuItemDetailsModal = dynamic(
  () => import("/modals/OrderMenuItemDetails"),
  { ssr: false }
);
const AddStoreModal = dynamic(() => import("/modals/AddStoreModal"));
const AddMenuSectionModal = dynamic(
  () => import("/modals/AddMenuSectionModal"),
  { ssr: false }
);

interface StoreProps {
  store: IStore;
  onStoreChange: (value: IStore, shouldSave: boolean) => void;
  selectedLocation: ILocation;
}

export const StoreContext = createContext<{
  store: IStore;
  setStore: (store: IStore) => void;
  search: string;
  setSearch: (search: string) => void;
  searchMobileVisible: boolean;
  setSearchMobileVisible: (visible: boolean) => void;
  isSearchMobileInScreen: boolean;
  searchMobileElement: HTMLInputElement | null;
  menuItemsRenderCount: MutableRefObject<number> | null;
}>({
  store: {} as IStore,
  setStore: () => {},
  search: "",
  setSearch: () => {},
  searchMobileVisible: false,
  setSearchMobileVisible: () => {},
  isSearchMobileInScreen: false,
  searchMobileElement: null,
  menuItemsRenderCount: null,
});

const Store: FC<StoreProps> = ({ store }) => {
  const menuItemsRenderCount = useRef(0);
  menuItemsRenderCount.current = 0;

  // const toast = useToast();
  const router = useRouter();

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const searchMobileRef = useRef<HTMLInputElement>();

  const [isSearchMobileInScreen, setIsSearchMobileInScreen] = useState(false);

  const [clientUser, setClientUser] = useState<IUser>();
  const [clientStore, setClientStore] = useState(store);

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

  const getStore = useGetStore();
  const putStore = usePutStore();
  const putMenuItem = usePutMenuItem();
  const deleteMenuSection = useDeleteStoreMenuSection();
  const putMenuSection = usePutStoreMenuSection();
  const putMenuSectionSection = usePutStoreMenuSectionSection();
  const putUser = usePutUser();

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
      value={{
        store: clientStore,
        setStore: setClientStore,
        search,
        setSearch,
        searchMobileVisible,
        setSearchMobileVisible,
        isSearchMobileInScreen,
        searchMobileElement: searchMobileRef.current as HTMLInputElement,
        menuItemsRenderCount,
      }}
    >
      <div className={classNames("font-lato custom-scrollbar min-h-screen")}>
        <StoreHeader />
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
        <Tabs>
          <TabPanel className="!p-0">
            <main>
              <Menu
                type="product"
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
            </main>
          </TabPanel>
          <TabPanel className="!p-0">
            <main>
              <Menu
                type="ingredient"
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
            </main>
          </TabPanel>
          {admin && (
            <TabList className="sticky bottom-0 border-t-2 border-solid border-hero bg-main-100 !z-10">
              <Tab>Produtos</Tab>
              <Tab>Ingredientes</Tab>
            </TabList>
          )}
        </Tabs>
        <footer className="bg-comanda-hero p-6 h-[var(--footer-height)] w-full flex flex-row items-center">
          <Link href="/">
            <Image
              className="w-[200px]"
              src="/logo.png"
              width={500}
              height={157}
              alt="Comanda Vip logo"
            />
          </Link>
        </footer>
        {editMenuItemObject && (
          <EditMenuItemModal
            open={
              !!router.query.editMenuItemId ||
              !!router.query.addMenuItemBySection
            }
            onOpenChange={comeBackToStoreRoot}
            store={clientStore}
            menuItem={editMenuItemObject}
            onStoreChange={async (newStore, shouldSave) => {
              setClientStore(newStore);
              if (shouldSave) {
                await putStore(newStore);
              }
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
                // toast(defaultToastError(err));
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
                  // toast(defaultToastError(err));
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
                // toast(defaultToastError(err));
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
                  // toast(defaultToastError(err));
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
