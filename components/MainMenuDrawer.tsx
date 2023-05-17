import { ComponentProps, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RiStore3Fill } from "react-icons/ri";
import { signIn, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";

import { IUser } from "/models/types/User";
import Drawer from "./Drawer";
import Button from "./form/Button";
import { StoreContext } from "./Store";
import classNames from "classnames";
import { useRouter } from "next/router";

interface MainMenuDrawerProps
  extends Omit<ComponentProps<typeof Drawer>, "children"> {
  onStoreDataClick: () => void;
}

const MainMenuDrawer: React.FC<MainMenuDrawerProps> = ({
  open,
  onClose,
  onStoreDataClick,
  ...props
}) => {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const { store } = useContext(StoreContext);

  const router = useRouter();

  const handleSignIn = () => {
    signIn();
  };

  return (
    <Drawer
      title={t("main.menu.drawer.title")}
      open={open}
      onClose={onClose}
      {...props}
    >
      {!admin && (
        <Button
          className="!w-full !justify-start mx-2 !py-4 !h-auto flex flex-row !items-center"
          variant="text"
          onClick={handleSignIn}
        >
          <FaUserCircle className="mr-4" size={36} />
          {t("signIn")}
        </Button>
      )}
      {admin && (
        <Button
          className="!w-full !justify-start mx-2 !py-4 !h-auto flex flex-row !items-center"
          variant="text"
          onClick={() => {
            onStoreDataClick();
            onClose();
          }}
        >
          <RiStore3Fill className="mr-4" size={36} />
          {t("store.data")}
        </Button>
      )}
      {store.menu.sections.map((section) => (
        <Button
          key={`${section._id}`}
          className={classNames(
            "!rounded-none !justify-start !normal-case border-b-[1px] w-full"
          )}
          onClick={() => {
            router.push("#menu-section-" + section._id);
            onClose();
          }}
        >
          {section.name}
        </Button>
      ))}
    </Drawer>
  );
};

export default MainMenuDrawer;
