import debounce from "lodash.debounce";
import { useCallback } from "react";

import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/types/Store";

const useReorderMenuItems = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const call = useCallback(
    debounce(
      async (
        store: IStore,
        sectionIndex: number[],
        idAndPosition: string[]
      ) => {
        const response = await axiosInstance.put(
          `/api/store/${store._id}/menu/section/${sectionIndex}/item/reorder/${idAndPosition}`
        );
        return response;
      },
      500
    ),
    []
  );
  return call;
};

export default useReorderMenuItems;
