import { ComponentProps } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RiStore3Fill } from "react-icons/ri";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";

import { IUser } from "/models/types/User";
import MenuSectionsTree from "./MenuSectionsTree";
import { IStore } from "/models/types/Store";

interface MainMenuDrawerProps
  extends Omit<ComponentProps<typeof Drawer>, "children"> {
  store: IStore;
  onStoreDataClick: () => void;
}

const MainMenuDrawer: React.FC<MainMenuDrawerProps> = ({
  store,
  isOpen,
  onClose,
  onStoreDataClick,
  ...props
}) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const handleSignIn = () => {
    signIn();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} isLazy={false}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton size="lg" />
        <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>

        <DrawerBody className="!p-0">
          {!admin && (
            <Button
              className="!w-full !justify-start mx-2 !py-4 !h-auto flex flex-row !items-center"
              variant="text"
              onClick={handleSignIn}
            >
              <FaUserCircle className="mr-4" size={36} />
              Entrar
            </Button>
          )}
          {admin && (
            <Button
              className="!w-full !justify-start mx-2 !py-4 !h-auto flex flex-row !items-center"
              variant="text"
              onClick={onStoreDataClick}
            >
              <RiStore3Fill className="mr-4" size={36} />
              Dados da Loja
            </Button>
          )}
          <MenuSectionsTree store={store} onCloseDrawer={onClose} />
        </DrawerBody>

        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MainMenuDrawer;
