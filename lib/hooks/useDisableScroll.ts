import { useEffect } from "react";

export default function useDisableScroll(disabled: boolean) {
  useEffect(() => {
    const list = ["overflow-hidden"];

    if (disabled) {
      document.body.classList.add(...list);
    } else {
      document.body.classList.remove(...list);
    }

    return () => {
      document.body.classList.remove(...list);
    };
  }, [disabled]);
}
