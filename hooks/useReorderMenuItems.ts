import debounce from "lodash.debounce";
import { useCallback } from "react";

import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/types/Store";
import useToast from "./useToast";

const useReorderMenuItems = () => {
  const toast = useToast();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const call = useCallback(
    debounce(
      async (store: IStore, sectionId: string, idAndPosition: string[]) => {
        const response = await axiosInstance.put(
          `/api/store/${store._id}/menu/section/${sectionId}/item/reorder/${idAndPosition}`
        );
        toast({
          message: "Item reordenado com sucesso!",
          type: "success",
        });
        return response;
      },
      500
    ),
    []
  );
  return call;
};

export default useReorderMenuItems;
