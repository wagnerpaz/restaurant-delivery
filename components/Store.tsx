import Image from "next/image";
import { FC, useCallback, useState } from "react";
import { RiUser3Fill } from "react-icons/ri";
import classNames from "classnames";
import cloneDeep from "lodash.clonedeep";
import { Button, Input } from "@material-tailwind/react";

import Menu from "/components/Menu/Menu";
import MenuSection from "/components/Menu/MenuSection";
import MenuItem from "/components/Menu/MenuItem";
import { ILocation, IMenuSection, IStore } from "/models/Store";
import Modal from "/components/Modal";
import EditMenuItem from "/forms/EditMenuItem";
import { IMenuItem } from "/models/MenuItem";
import useDeleteMenuItem from "/hooks/useDeleteMenuItem";
import { IIngredient } from "/models/Ingredients";
import { replaceAt, swap } from "/lib/immutable";
import useGetStoreMenuSectionItems from "/hooks/useGetStoreMenuSectionItems";
import usePutMenuItem from "/hooks/usePutMenuItem";
import DraggableGroup from "./DraggableGroup";
import Draggable from "./Draggable";

interface StoreProps {
  store: IStore;
  onStoreChange: (value: IStore) => void;
  ingredients: IIngredient[];
  selectedLocation: ILocation;
}

const emptyMenuItem: IMenuItem = {
  name: "",
  details: {},
  images: {},
  composition: [{ ingredient: undefined, quantity: 1, essential: false }],
};

const Store: FC<StoreProps> = ({ store, selectedLocation, ingredients }) => {
  const [clientStore, setClientStore] = useState(store);
  const [clientIngredients, setClientIngredients] = useState(ingredients);

  const [editMenuItemModalOpen, setEditMenuItemModalOpen] = useState(false);
  const [editMenuItemIndex, setEditMenuItemIndex] = useState(-1);
  const [editMenuItemObject, setEditMenuItemObject] = useState({
    ...emptyMenuItem,
  } as IMenuItem);
  const [editMenuItemSectionIndex, setEditMenuItemSectionIndex] = useState(-1);

  const putMenuItem = usePutMenuItem();
  const deleteMenuItem = useDeleteMenuItem();

  const onFindMenuItem = useCallback(
    (section: IMenuSection) => (id: string) => {
      const index = section.items.findIndex((f) => f._id === id);
      return {
        menuItem: section.items[index],
        index,
      };
    },
    []
  );

  const onDropMenuItem = useCallback(
    (section: IMenuSection) => (id: string, atIndex: number) => {
      const { index } = onFindMenuItem(section)(id);
      setClientStore((clientStore) => {
        const menu = clientStore.menu;
        const sections = menu.sections;
        const sectionIndex = sections.findIndex((f) => f.name === section.name);
        return {
          ...clientStore,
          menu: {
            ...menu,
            sections: [
              ...replaceAt(sections, sectionIndex, {
                ...sections[sectionIndex],
                items: swap(sections[sectionIndex].items, index, atIndex),
              }),
            ],
          },
        } as IStore;
      });
    },
    [onFindMenuItem]
  );

  return (
    <div
      className={classNames("font-lato", {
        "fixed top-0 left-0 w-full h-full overflow-hidden":
          editMenuItemModalOpen,
      })}
    >
      <header className="bg-dark-500 text-light-high sticky top-0 z-10 shadow-lg">
        <div className="flex flex-row items-center gap-4 px-6 py-4">
          <Image
            className="rounded-md"
            src={`/api/download?id=${clientStore.logo}`}
            alt={`${clientStore.name} logo`}
            width={50}
            height={50}
          />
          <div className="flex-1 overflow-hidden">
            <h1 className="hidden md:block font-bold text-xl">
              {clientStore.name}
            </h1>
            <address className="hidden md:block text-sm text-light-medium overflow-hidden w-full text-ellipsis whitespace-nowrap">
              <span className="font-bold mr-2 text-light-high">
                {selectedLocation.city} - {selectedLocation.state}
              </span>
              <span>
                {selectedLocation.address} {selectedLocation.number},{" "}
                {selectedLocation.neighborhood}, {selectedLocation.postalCode}
              </span>
            </address>
          </div>
          <Input
            id="search"
            containerProps={{ className: "!w-full !min-w-0 max-w-xs" }}
            label="Pesquisar"
          ></Input>
          <Button className="flex flex-row gap-2 items-center">
            <RiUser3Fill />
            Entrar
          </Button>
        </div>
      </header>
      <main>
        <Menu>
          {clientStore.menu.sections.map((section, sectionIndex) => (
            <MenuSection
              className="mb-4"
              key={section.name}
              name={section.name}
              length={section.items.length}
              onAddClick={() => {
                setEditMenuItemObject({ ...emptyMenuItem } as IMenuItem);
                setEditMenuItemIndex(-1);
                setEditMenuItemSectionIndex(sectionIndex);
                setEditMenuItemModalOpen(true);
              }}
            >
              <DraggableGroup>
                {section.items.map((menuItem, menuItemIndex) => (
                  <Draggable
                    containerClassName="h-full"
                    key={menuItem.name}
                    id={menuItem._id}
                    originalIndex={menuItemIndex}
                    onFind={onFindMenuItem(section)}
                    onDrop={onDropMenuItem(section)}
                  >
                    <MenuItem
                      name={menuItem.name}
                      id={menuItem._id}
                      mainImageId={menuItem.images?.main?.toString()}
                      price={menuItem.price}
                      composition={menuItem.composition}
                      sides={menuItem.sides}
                      index={menuItemIndex}
                      editable
                      useEffects
                      onEditClick={() => {
                        setEditMenuItemObject({ ...menuItem } as IMenuItem);
                        setEditMenuItemIndex(menuItemIndex);
                        setEditMenuItemSectionIndex(sectionIndex);
                        setEditMenuItemModalOpen(true);
                      }}
                      onDeleteClick={() => {
                        const confirmed = confirm(
                          `Deseja excluir o item "${menuItem.name}"?`
                        );
                        if (confirmed) {
                          deleteMenuItem(store._id, menuItem._id);
                          const cloneStore = cloneDeep(clientStore);
                          const section =
                            cloneStore.menu.sections[sectionIndex];
                          section.items = section.items.filter(
                            (f) => f._id !== menuItem._id
                          );
                          console.log("section", section);
                          setClientStore(cloneStore);
                        }
                      }}
                    />
                  </Draggable>
                ))}
              </DraggableGroup>
            </MenuSection>
          ))}
        </Menu>
      </main>
      <Modal
        className="!z-40"
        open={editMenuItemModalOpen}
        onOpenChange={(newValue: boolean) => setEditMenuItemModalOpen(newValue)}
      >
        <EditMenuItem
          store={clientStore}
          ingredients={clientIngredients}
          menuItem={editMenuItemObject}
          onStoreChange={(newStore) => setClientStore(newStore)}
          onIngredientsChange={(newIngredients) =>
            setClientIngredients(newIngredients)
          }
          onMenuItemChange={async (newMenuItem?: IMenuItem) => {
            if (!newMenuItem) {
              return;
            }

            const serverMenuItem = await putMenuItem(
              store,
              newMenuItem,
              editMenuItemSectionIndex
            );

            const menu = clientStore.menu;
            const sections = menu.sections;
            const section = sections[editMenuItemSectionIndex];
            setClientStore({
              ...clientStore,
              menu: {
                ...menu,
                sections: replaceAt(sections, editMenuItemSectionIndex, {
                  ...section,
                  items: replaceAt(
                    section.items,
                    editMenuItemIndex > 0
                      ? editMenuItemIndex
                      : section.items.length,
                    serverMenuItem
                  ),
                }),
              },
            } as IStore);

            setEditMenuItemObject({ ...emptyMenuItem });
            setEditMenuItemIndex(-1);
            setEditMenuItemSectionIndex(-1);
            setEditMenuItemModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Store;
