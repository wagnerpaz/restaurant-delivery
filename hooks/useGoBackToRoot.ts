import { useContext } from "react";
import { useRouter } from "next/router";

import { StoreContext } from "/components/Store";

export default function useGoBackToRoot(shallow = true) {
  const { store } = useContext(StoreContext);
  const router = useRouter();

  const goBackToRoot = () => {
    router.push(`/store/${store.slug}`, undefined, {
      shallow,
    });
  };
  return goBackToRoot;
}
