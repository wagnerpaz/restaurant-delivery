import { RefObject, useEffect, useCallback } from "react";

type Callback = (event: MouseEvent | TouchEvent) => void;

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: Callback
): void => {
  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const current = ref?.current;

      if (!current) {
        return;
      }

      if (
        typeof current.contains === "function" &&
        !current.contains(event.target as Node)
      ) {
        callback(event);
      }
    },
    [ref, callback]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handleClickOutside]);
};

export default useOnClickOutside;
