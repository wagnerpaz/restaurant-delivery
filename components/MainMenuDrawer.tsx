import { ComponentProps } from "react";
import { FaUserCircle } from "react-icons/fa";
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

import { IUser } from "/models/User";
import MenuSectionsAccordion from "./MenuSectionsAccordion";
import { IStore } from "/models/Store";

interface MainMenuDrawerProps extends ComponentProps<typeof Drawer> {
  store: IStore;
}

const MainMenuDrawer: React.FC<MainMenuDrawerProps> = ({
  store,
  children,
  isOpen,
  onClose,
  ...props
}) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const handleSignIn = () => {
    signIn();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
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
          <MenuSectionsAccordion store={store} onCloseDrawer={onClose} />
        </DrawerBody>

        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MainMenuDrawer;
