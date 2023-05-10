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
import { ILocation, IStore } from "/models/types/Store";

import { IMenuItem } from "/models/types/MenuItem";
import usePutMenuItem from "/hooks/usePutMenuItem";
import { IUser } from "/models/types/User";
import usePutStore from "/hooks/usePutStore";
import {
  findMenuItemSectionIndex,
  replaceObjectById,
  retriveAllMenuItems as retrieveAllMenuItems,
} from "/lib/menuSectionUtils";
import useGetStore from "/hooks/useGetStore";
import usePutUser from "/hooks/usePutUser";
import { emptyMenuItem } from "./Menu/MenuItem";
import StoreHeader from "./StoreHeader";
import Input from "./form/Input";
import useGoBackToRoot from "/hooks/useGoBackToRoot";

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

  console.log("Server Store", store);

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

  const putStore = usePutStore();
  const putUser = usePutUser();

  const [tabIndex, setTabIndex] = useState(0);

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

  const goBackToRoot = useGoBackToRoot();

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
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
          <TabPanel className={classNames({ "min-h-screen": tabIndex === 0 })}>
            <main>
              <Menu type="product" sections={clientStore.menu.sections} />
            </main>
          </TabPanel>
          <TabPanel className={classNames({ "min-h-screen": tabIndex === 1 })}>
            <main>
              <Menu type="ingredient" sections={clientStore.menu.sections} />
            </main>
          </TabPanel>
          <TabList
            className={classNames(
              "sticky bottom-0 border-t-2 border-solid border-hero bg-main-100 !z-10",
              { hidden: !admin }
            )}
          >
            <Tab
              className="react-tabs__tab tab"
              selectedClassName="tab-selected"
            >
              Produtos
            </Tab>
            <Tab
              className="react-tabs__tab tab"
              selectedClassName="tab-selected"
            >
              Ingredientes
            </Tab>
          </TabList>
        </Tabs>
        <footer className="bg-comanda-hero absolute z-10 p-6 h-[var(--footer-height)] w-full flex flex-row items-center">
          <Link href="/">
            <Image
              className="w-[200px]"
              src="/logo.png"
              width={200}
              height={63}
              alt="Comanda Vip logo"
            />
          </Link>
        </footer>

        {orderMenuItemDetailsOpen && orderMenuItemDetailObject && (
          <OrderMenuItemDetailsModal
            store={clientStore}
            portalTarget={() => document.body}
            menuItem={orderMenuItemDetailObject}
            open={orderMenuItemDetailsOpen}
            onOpenChange={goBackToRoot}
          />
        )}
        {editUserAddressesOpen && (
          <EditAddressModal
            open={editUserAddressesOpen}
            locations={editUserAddressesObject}
            onOpenChange={goBackToRoot}
            onLocationsChange={async (locations) => {
              const serverUser = await putUser({
                ...clientUser,
                locations,
              } as IUser);
              setClientUser(serverUser);
              goBackToRoot(false);
            }}
          />
        )}
        {restoreTrashForSectionIndexOpen && (
          <EditMenuItemTrashModal
            open={restoreTrashForSectionIndexOpen}
            onOpenChange={goBackToRoot}
            store={clientStore}
          />
        )}
      </div>
    </StoreContext.Provider>
  );
};

export default Store;
