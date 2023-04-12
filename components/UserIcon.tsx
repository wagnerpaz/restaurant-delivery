import React, { useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@material-tailwind/react";

import useOnClickOutside from "/lib/hooks/useOnClickOutside";

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
            className="rounded-full cursor-pointer border-light-high border-[1px]"
            onClick={() => setMenuOpened(!menuOpened)}
          />
          {menuOpened && (
            <div
              ref={container}
              className="absolute top-0 right-0 bg-dark-100 p-2 px-4 rounded-md shadow-lg z-50 m-4"
            >
              <small className="block">Autenticado como</small>
              <strong>{session.user.email ?? session.user.name}</strong>
              <div className="border-b-[1px] -mx-4 pb-2 border-dark-400" />
              <Button
                variant="text"
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
