import axiosInstance from "/lib/axiosInstance";
import { IMenuItem } from "/models/types/MenuItem";
import { IStore } from "/models/types/Store";

const usePutMenuItem = () => {
  const call = async (
    store: IStore,
    menuItem: IMenuItem,
    sectionId?: string
  ) => {
    if (menuItem._id) {
      const response = await axiosInstance.put(
        `/api/store/${store._id}/menu/section/${sectionId}/item/${menuItem._id}`,
        menuItem
      );
      return response.data;
    } else {
      const response = await axiosInstance.post(
        `/api/store/${store._id}/menu/section/${sectionId}/item`,
        menuItem
      );
      return response.data;
    }
  };
  return call;
};

export default usePutMenuItem;
