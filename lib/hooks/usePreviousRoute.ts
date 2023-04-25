import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function usePreviousRoute() {
  const router = useRouter();

  const [prevRoute, setPrevRoute] = useState<string>();
  const [currRoute, setCurrRoute] = useState<string>();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setPrevRoute(currRoute);
      setCurrRoute(url);
    };
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      console.log("unmount");
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return { prevRoute, currRoute };
}
