import { ComponentProps, useContext, useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import dynamic from "next/dynamic";

import Button from "/components/form/Button";
import DebouncedInput from "./DebouncedInput";
import ImageWithFallback from "./ImageWithFallback";
import MainMenuDrawer from "./MainMenuDrawer";
import { StoreContext } from "./Store";
import UserIcon from "./UserIcon";
import { useRouter } from "next/router";
import useGoBackToRoot from "/hooks/useGoBackToRoot";
import Input from "./form/Input";

const AddStoreModal = dynamic(() => import("/modals/AddStoreModal"));

interface StoreHeaderProps extends ComponentProps<"section"> {}

const StoreHeader: React.FC<StoreHeaderProps> = () => {
  const { store, search, setSearch } = useContext(StoreContext);

  const searchMobileRef = useRef<HTMLInputElement>();

  const [searchMobileVisible, setSearchMobileVisible] = useState(false);
  const [isSearchMobileInScreen, setIsSearchMobileInScreen] = useState(false);

  const currLocation = store.locations[0];

  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const goBackToRoot = useGoBackToRoot();

  const editStore = router.query.editStore;

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

  useEffect(() => {
    if (searchMobileVisible) {
      searchMobileRef.current?.focus();
    }
  }, [searchMobileVisible]);

  return (
    <>
      <header className="bg-hero text-hero-a11y-high h-[var(--header-height)] sticky top-0 shadow-md z-20 flex flex-row items-center w-full">
        <div className="flex flex-row items-center justify-between gap-2 px-3 sm:px-6 w-full">
          <div className="flex flex-row items-center gap-2">
            <ImageWithFallback
              className="rounded-md w-[50px] h-[50px]"
              src={store?.logo}
              alt={`${store?.name} logo`}
              width={50}
              height={50}
              cdn
              loading="eager"
            />
            <div className="flex-1 overflow-hidden hidden sm:block">
              <h1 className="hidden md:block font-bold text-xl text-ellipsis overflow-hidden whitespace-nowrap">
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
          </div>
          <div className="flex flex-row items-center gap-4">
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
                    searchMobileRef.current?.focus();
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
            <UserIcon />
          </div>
        </div>
        <MainMenuDrawer
          open={drawerOpen}
          title="Menu"
          onClose={() => setDrawerOpen(false)}
          onStoreDataClick={() =>
            router.push(`/store/${store.slug}?editStore=true`)
          }
        />
        {editStore && (
          <AddStoreModal
            portalTarget={() => null}
            noAutoClose={!store}
            open={!!editStore}
            onOpenChange={(value) => {
              if (!value) {
                goBackToRoot();
              }
            }}
          />
        )}
      </header>
      {searchMobileVisible && (
        <Input
          ref={searchMobileRef}
          id="search-mobile"
          className="!w-full !min-w-0 !bg-main-100 !text-main-a11y-high !rounded-none !mt-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar..."
        ></Input>
      )}
    </>
  );
};

export default StoreHeader;
