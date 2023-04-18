import React, { useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

import useOnClickOutside from "/lib/hooks/useOnClickOutside";
import { Button } from "@chakra-ui/react";

const UserIcon = () => {
  const { data: session, status } = useSession();

  const container = useRef(null);

  const [menuOpened, setMenuOpened] = useState(false);

  useOnClickOutside(container, () => {
    setMenuOpened(false);
  });

  return (
    <>
      {session?.user && (
        <>
          <Image
            alt="user image"
            src={session.user.image}
            width={40}
            height={40}
            className="rounded-full cursor-pointer border-solid border-hero-a11y-high border-2"
            onClick={() => setMenuOpened(!menuOpened)}
          />
          {menuOpened && (
            <div
              ref={container}
              className="absolute top-14 right-0 bg-main-100 p-2 px-4 rounded-md shadow-lg z-50 m-4 text-main-a11y-high"
            >
              <small className="block">Autenticado como</small>
              <strong>{session.user.email ?? session.user.name}</strong>
              <div className="border-b-[1px] -mx-4 pb-2 border-main-400" />
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  signOut();
                }}
              >
                Sign out
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserIcon;
