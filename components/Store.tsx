import Image from "next/image";
import { FC } from "react";
import { MdLocationPin } from "react-icons/md";
import { RiUser3Fill } from "react-icons/ri";

import Button from "/components/Button";
import Menu from "/components/Menu/Menu";
import MenuSection from "/components/Menu/MenuSection";
import MenuItem from "/components/Menu/MenuItem";
import { ILocation, IStore } from "/models/Store";
import Input from "/components/Input";

interface StoreProps {
  store: IStore;
  selectedLocation: ILocation;
}

const Store: FC<StoreProps> = ({ store, selectedLocation }) => {
  return (
    <>
      <header className="bg-dark-500 text-light-high sticky top-0 z-10 shadow-lg">
        <div className="flex flex-row gap-4 px-6 py-4">
          <Image
            className="rounded-md"
            src={`/api/download?id=${store.logo}`}
            alt={`${store.name} logo`}
            width={50}
            height={50}
          />
          <div>
            <h1 className="font-bold text-xl">{store.name}</h1>
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
          {store.menu.sections.map((section) => (
            <MenuSection
              key={section.name}
              name={section.name}
              length={section.items.length}
            >
              {section.items.map((menuItem) => (
                <>
                  <MenuItem
                    key={menuItem.name}
                    name={menuItem.name}
                    mainImageId={menuItem.images.main?.toString()}
                    composition={menuItem.composition}
                    sides={menuItem.sides}
                  />
                </>
              ))}
            </MenuSection>
          ))}
        </Menu>
      </main>
    </>
  );
};

export default Store;
