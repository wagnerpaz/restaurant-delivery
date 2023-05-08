import React, { useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { FaAddressBook, FaSignOutAlt } from "react-icons/fa";

import Button from "/components/form/Button";
import useOnClickOutside from "/lib/hooks/useOnClickOutside";
import { useRouter } from "next/router";

const UserIcon = ({ store }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const container = useRef(null);

  const [menuOpened, setMenuOpened] = useState(false);

  useOnClickOutside(container, () => {
    setMenuOpened(false);
  });

  return (
    <>
      {session?.user && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img
            alt="User image"
            src={session.user.image as string}
            width={40}
            height={40}
            className="rounded-full cursor-pointer border-solid border-hero-a11y-high border-2"
            onClick={() => setMenuOpened(!menuOpened)}
          />
          {menuOpened &&
            createPortal(
              <div
                ref={container}
                className="absolute top-14 right-0 bg-main-100 p-2 px-4 rounded-md shadow-lg z-50 m-4 text-main-a11y-high"
              >
                <small className="block">Autenticado como</small>
                <strong>{session.user.email ?? session.user.name}</strong>
                <div className="border-b -mx-4 pb-3 border-main-a11y-low" />
                <nav className="-mx-4 mt-1 flex ">
                  <Button
                    className="flex-row items-center gap-2"
                    variant="text"
                    onClick={() => {
                      router.push(
                        `/store/${store.slug}?addressesUserId=${session?.user?.id}`,
                        undefined,
                        { shallow: true }
                      );
                      setMenuOpened(false);
                    }}
                  >
                    <FaAddressBook size={24} />
                    Meu Endereço
                  </Button>
                </nav>
                <div className="border-b -mx-4 pb-2 border-main-a11y-low" />
                <Button
                  className="mt-4 mb-2 w-full flex flex-row gap-1 items-center"
                  onClick={() => {
                    signOut();
                  }}
                >
                  <FaSignOutAlt />
                  Sair
                </Button>
              </div>,
              document.body
            )}
        </>
      )}
    </>
  );
};

export default UserIcon;
