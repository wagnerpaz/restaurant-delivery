import debounce from "lodash.debounce";
import { useCallback } from "react";

import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/Store";

const useSwapMenuItems = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const call = useCallback(
    debounce(
      async (store: IStore, sectionIndex: number[], swapIds: string[]) => {
        const response = await axiosInstance.put(
          `/api/store/${store._id}/menu/section/${sectionIndex}/item/swap/${swapIds}`
        );
        return response;
      },
      500
    ),
    []
  );
  return call;
};

export default useSwapMenuItems;
