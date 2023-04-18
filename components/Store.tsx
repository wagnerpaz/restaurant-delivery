import { FC, useCallback, useState } from "react";
import { RiUser3Fill } from "react-icons/ri";
import classNames from "classnames";
import cloneDeep from "lodash.clonedeep";
import { signIn, signOut, useSession } from "next-auth/react";

import Menu from "/components/Menu/Menu";
import MenuSection from "/components/Menu/MenuSection";
import MenuItem from "/components/Menu/MenuItem";
import { ILocation, IMenuSection, IStore } from "/models/Store";
import EditMenuItemModal from "/forms/EditMenuItemForm";
import { IMenuItem } from "/models/MenuItem";
import useDeleteMenuItem from "/hooks/useDeleteMenuItem";
import { IIngredient } from "/models/Ingredients";
import { replaceAt, swap } from "/lib/immutable";
import usePutMenuItem from "/hooks/usePutMenuItem";
import DraggableGroup from "/components/DraggableGroup";
import Draggable from "/components/Draggable";
import UserIcon from "/components/UserIcon";
import { IUser } from "/models/User";
import useSwapMenuItems from "/hooks/useSwapMenuItems";
import DbImage from "./DbImage";
import AddStoreModal from "/modals/AddStoreModal";
import usePutStore from "/hooks/usePutStore";
import { Button, Input } from "@chakra-ui/react";
import FormControl from "./FormControl";

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

const Store: FC<StoreProps> = ({ store, selectedLocation, ingredients }) => {
  const [clientStore, setClientStore] = useState(store);
  const [clientIngredients, setClientIngredients] = useState(ingredients);
  const clientLocation = selectedLocation || clientStore?.locations?.[0];

  const [editMenuItemModalOpen, setEditMenuItemModalOpen] = useState(false);
  const [editMenuItemIndex, setEditMenuItemIndex] = useState(-1);
  const [editMenuItemObject, setEditMenuItemObject] = useState({
    ...emptyMenuItem,
  } as IMenuItem);
  const [editMenuItemSectionIndex, setEditMenuItemSectionIndex] = useState([
    -1,
  ]);

  const [addStoreModalOpen, setAddStoreModalOpen] = useState(!store);

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
  const swapMenuItems = useSwapMenuItems();

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

  const handleSignIn = () => {
    signIn();
  };

  const renderMenuSections = (
    sections: IMenuSection[] = [],
    path: IMenuSection[] = [],
    indexPath: number[] = []
  ) => {
    return sections.map((section, sectionIndex) => (
      <>
        {(admin
          ? true
          : section.items?.filter((f) => !f.hidden).length > 0) && (
          <MenuSection
            key={section.name}
            name={[path.map((p) => p.name).join(" • "), section.name]
              .filter((f) => f)
              .join(" • ")}
            length={section.items.length}
            onAddClick={() => {
              setEditMenuItemObject({ ...emptyMenuItem } as IMenuItem);
              setEditMenuItemIndex(-1);
              setEditMenuItemSectionIndex([...indexPath, sectionIndex]);
              setEditMenuItemModalOpen(true);
            }}
          >
            <AdminDraggableGroup className="contents" editable={admin}>
              {section.items.map((menuItem, menuItemIndex) => (
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
                    hidden={menuItem.hidden}
                    descriptionShort={menuItem.details?.short}
                    composition={menuItem.composition}
                    sides={menuItem.sides}
                    index={menuItemIndex}
                    editable={admin}
                    useEffects
                    onEditClick={() => {
                      setEditMenuItemObject({ ...menuItem } as IMenuItem);
                      setEditMenuItemIndex(menuItemIndex);
                      setEditMenuItemSectionIndex([...indexPath, sectionIndex]);
                      setEditMenuItemModalOpen(true);
                    }}
                    onDeleteClick={() => {
                      const confirmed = confirm(
                        `Deseja excluir o item "${menuItem.name}"?`
                      );
                      if (confirmed) {
                        deleteMenuItem(
                          store,
                          [...indexPath, sectionIndex],
                          menuItem
                        );
                        const cloneStore = cloneDeep(clientStore);
                        const section = cloneStore.menu.sections[sectionIndex];
                        section.items = section.items.filter(
                          (f) => f._id !== menuItem._id
                        );
                        setClientStore(cloneStore);
                      }
                    }}
                  />
                </AdminDraggable>
              ))}
            </AdminDraggableGroup>
          </MenuSection>
        )}
        {renderMenuSections(
          section.sections || [],
          [...path, section],
          [...indexPath, sectionIndex]
        )}
      </>
    ));
  };

  return (
    <div
      className={classNames("font-lato custom-scrollbar", {
        "fixed top-0 left-0 w-full h-full overflow-hidden":
          editMenuItemModalOpen,
      })}
    >
      <header className="bg-hero text-hero-a11y-high sticky top-0 shadow-lg z-20">
        <div className="flex flex-row items-center gap-4 px-6 py-4">
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
          <Input
            id="search"
            className="!w-full !min-w-0 max-w-xs !bg-main-100"
            placeholder="Pesquisar..."
          ></Input>
          {!session?.user && !loading && (
            <Button
              className="flex flex-row gap-2 items-center"
              onClick={handleSignIn}
            >
              <RiUser3Fill />
              Entrar
            </Button>
          )}
          <UserIcon />
        </div>
      </header>
      <main>
        <Menu>{renderMenuSections(clientStore?.menu?.sections)}</Menu>
      </main>
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

          const serverMenuItem = await putMenuItem(
            store,
            newMenuItem,
            editMenuItemSectionIndex
          );

          const cloneStore = cloneDeep(clientStore);
          const menu = cloneStore.menu;

          let curSection = menu as IMenuSection;
          for (const index of editMenuItemSectionIndex) {
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
          setEditMenuItemSectionIndex([-1]);
          setEditMenuItemModalOpen(false);
        }}
      />
      {addStoreModalOpen && (
        <AddStoreModal
          store={clientStore}
          onStoreChange={async (value, shouldSave) => {
            setClientStore(value);
            if (shouldSave) {
              await putStore(value);
              setAddStoreModalOpen(false);
            }
          }}
          portalTarget={() => null}
          noAutoClose
          open={addStoreModalOpen}
          onOpenChange={(value) => setAddStoreModalOpen(value)}
        />
      )}
    </div>
  );
};

export default Store;
