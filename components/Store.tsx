import Image from "next/image";
import { FC, useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { RiUser3Fill } from "react-icons/ri";
import classNames from "classnames";
import cloneDeep from "lodash.clonedeep";

import Button from "/components/Button";
import Menu from "/components/Menu/Menu";
import MenuSection from "/components/Menu/MenuSection";
import MenuItem from "/components/Menu/MenuItem";
import { ILocation, IStore } from "/models/Store";
import Input from "/components/Input";
import Modal from "/components/Modal";
import EditMenuItem from "/forms/EditMenuItem";
import { IMenuItem } from "/models/MenuItem";
import usePutStore from "/hooks/usePutStore";
import usePutMenuItem from "/hooks/usePutMenuItem";

interface StoreProps {
  store: IStore;
  onStoreChange: (value: IStore) => void;
  selectedLocation: ILocation;
}

const emptyMenuItem: IMenuItem = {
  name: "",
  details: {},
  images: {},
  composition: [{ ingredient: undefined, quantity: 1, essential: false }],
};

const Store: FC<StoreProps> = ({ store, selectedLocation }) => {
  const [clientStore, setClientStore] = useState(store);

  const [editMenuItemModalOpen, setEditMenuItemModalOpen] = useState(false);
  const [editMenuItemObject, setEditMenuItemObject] = useState({
    ...emptyMenuItem,
  });
  const [editMenuItemSectionIndex, setEditMenuItemSectionIndex] = useState(-1);

  const putStore = usePutStore();
  const putMenuItem = usePutMenuItem();

  return (
    <div
      className={classNames({
        "fixed top-0 left-0 w-full h-full overflow-hidden":
          editMenuItemModalOpen,
      })}
    >
      <header className="bg-dark-500 text-light-high sticky top-0 z-10 shadow-lg">
        <div className="flex flex-row gap-4 px-6 py-4">
          <Image
            className="rounded-md"
            src={`/api/download?id=${clientStore.logo}`}
            alt={`${clientStore.name} logo`}
            width={50}
            height={50}
          />
          <div>
            <h1 className="font-bold text-xl">{clientStore.name}</h1>
            <address className="flex flex-row items-center text-sm">
              <MdLocationPin className="inline mr-1" />
              <span className="font-bold mr-2">
                {selectedLocation.city} - {selectedLocation.state}
              </span>
              <span className="text-light-medium">
                {selectedLocation.address} {selectedLocation.number},{" "}
                {selectedLocation.neighborhood}
              </span>
              <span className="text-light-medium">
                , {selectedLocation.postalCode}
              </span>
            </address>
          </div>
          <Input
            className="outline-none"
            id="search"
            variant="search"
            placeholder="Pesquisar"
          ></Input>
          <div className="flex-1" />
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
                setEditMenuItemObject({ ...emptyMenuItem });
                setEditMenuItemSectionIndex(sectionIndex);
                setEditMenuItemModalOpen(true);
              }}
            >
              {section.items.map((menuItem, menuItemIndex) => (
                <>
                  <MenuItem
                    key={menuItem.name}
                    name={menuItem.name}
                    mainImageId={menuItem.images?.main?.toString()}
                    composition={menuItem.composition}
                    sides={menuItem.sides}
                    index={menuItemIndex}
                  />
                </>
              ))}
            </MenuSection>
          ))}
        </Menu>
      </main>
      <Modal
        open={editMenuItemModalOpen}
        onOpenChange={(newValue: boolean) => setEditMenuItemModalOpen(newValue)}
      >
        <EditMenuItem
          store={clientStore}
          menuItem={editMenuItemObject}
          onMenuItemChange={async (newMenuItem, menuItemIndex) => {
            const storeClone = cloneDeep(clientStore);
            const items =
              storeClone.menu.sections[editMenuItemSectionIndex].items;

            const serverMenuItem = await putMenuItem(
              storeClone,
              newMenuItem,
              editMenuItemSectionIndex
            );

            if (menuItemIndex) {
              items.splice(menuItemIndex, 1, serverMenuItem);
            } else {
              items.push(serverMenuItem);
            }

            setClientStore(storeClone);
          }}
        />
      </Modal>
    </div>
  );
};

export default Store;
