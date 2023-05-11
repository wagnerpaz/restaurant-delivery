import {
  FC,
  MutableRefObject,
  useMemo,
  useRef,
  useState,
  createContext,
} from "react";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import Menu from "/components/Menu/Menu";
import { ILocation, IStore } from "/models/types/Store";

import { IUser } from "/models/types/User";
import { retriveAllMenuItems as retrieveAllMenuItems } from "/lib/menuSectionUtils";
import StoreHeader from "./StoreHeader";
import useGoBackToRoot from "/hooks/useGoBackToRoot";

const EditMenuItemTrashModal = dynamic(
  () => import("/modals/EditMenuItemTrashModal"),
  { ssr: false }
);
const OrderMenuItemDetailsModal = dynamic(
  () => import("/modals/OrderMenuItemDetails"),
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
  menuItemsRenderCount: MutableRefObject<number> | null;
}>({
  store: {} as IStore,
  setStore: () => {},
  search: "",
  setSearch: () => {},
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

  const [clientStore, setClientStore] = useState(store);

  const [search, setSearch] = useState("");

  const orderMenuItemDetailObject = useMemo(
    () =>
      retrieveAllMenuItems(clientStore?.menu?.sections || []).find(
        (f) => f._id === router.query.orderItem
      ),
    [clientStore?.menu?.sections, router.query.orderItem]
  );
  const orderMenuItemDetailsOpen = !!router.query.orderItem;

  const restoreTrashForSectionIndexOpen =
    !!router.query.restoreTrashForSectionIndex;

  const [tabIndex, setTabIndex] = useState(0);

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
        menuItemsRenderCount,
      }}
    >
      <div className={classNames("font-lato custom-scrollbar min-h-screen")}>
        <StoreHeader />
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
            portalTarget={() => document.body}
            menuItem={orderMenuItemDetailObject}
            open={orderMenuItemDetailsOpen}
            onOpenChange={goBackToRoot}
          />
        )}
        {restoreTrashForSectionIndexOpen && (
          <EditMenuItemTrashModal
            open={restoreTrashForSectionIndexOpen}
            onOpenChange={goBackToRoot}
          />
        )}
      </div>
    </StoreContext.Provider>
  );
};

export default Store;
