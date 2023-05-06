import { Button } from "@chakra-ui/react";
import { ComponentProps, useContext, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";

import DebouncedInput from "./DebouncedInput";
import ImageWithFallback from "./ImageWithFallback";
import MainMenuDrawer from "./MainMenuDrawer";
import { StoreContext } from "./Store";
import UserIcon from "./UserIcon";

interface StoreHeaderProps extends ComponentProps<"section"> {}

const StoreHeader: React.FC<StoreHeaderProps> = () => {
  const {
    store,
    search,
    setSearch,
    searchMobileVisible,
    setSearchMobileVisible,
    isSearchMobileInScreen,
    searchMobileElement,
  } = useContext(StoreContext);

  const currLocation = store.locations[0];

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="bg-hero text-hero-a11y-high h-[var(--header-height)] sticky top-0 shadow-md z-20 flex flex-row items-center w-full">
      <div className="flex flex-row items-center gap-2 px-3 sm:px-6 w-full">
        <ImageWithFallback
          className="rounded-md w-[50px] h-[50px]"
          src={store?.logo}
          alt={`${store?.name} logo`}
          width={50}
          height={50}
          cdn
        />
        <div className="flex-1 overflow-hidden hidden sm:block">
          <h1 className="hidden md:block font-bold text-xl">
            {store?.name || "Nome da sua loja"}
          </h1>
          <address className="hidden md:block text-sm text-hero-a11y-medium overflow-hidden w-full text-ellipsis whitespace-nowrap">
            <span className="font-bold mr-2 text-hero-a11y-high">
              {currLocation?.city || "[Cidade]"} -{" "}
              {currLocation?.state || "[ES]"}
            </span>
            <span>
              {currLocation?.address || "[Endereço]"}{" "}
              {currLocation?.number || "[Número]"},{" "}
              {currLocation?.neighborhood || "[Bairro]"},{" "}
              {currLocation?.postalCode || "[CEP]"}
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
          aria-label="Menu"
          onClick={() => {
            if (searchMobileVisible) {
              if (!isSearchMobileInScreen) {
                searchMobileElement?.focus();
              } else {
                setSearchMobileVisible(false);
              }
            } else {
              setSearchMobileVisible(true);
            }
          }}
        >
          <FaSearch size={22} />
        </Button>
        <Button
          className="flex flex-row gap-2 items-center !px-0"
          variant="text"
          aria-label="Pesquisar"
          onClick={() => setDrawerOpen(true)}
        >
          <HiMenu size={36} />
        </Button>
        <UserIcon store={store} />
      </div>
      <MainMenuDrawer
        store={store}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStoreDataClick={() => {
          setDrawerOpen(false);
        }}
      />
    </header>
  );
};

export default StoreHeader;
