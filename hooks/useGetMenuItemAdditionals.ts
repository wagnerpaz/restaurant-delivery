import { useCallback } from "react";
import axiosInstance from "/lib/axiosInstance";
import { IMenuItem } from "/models/types/MenuItem";
import { IStore } from "/models/types/Store";

const useGetMenuItemsAdditionals = () => {
  const call = useCallback(async (store: IStore, menuItem: IMenuItem) => {
    const response = await axiosInstance.get(
      `/api/store/${store._id}/menu/item/${menuItem._id}/additionals`
    );
    return response.data;
  }, []);
  return call;
};

export default useGetMenuItemsAdditionals;
