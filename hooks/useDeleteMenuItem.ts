import axiosInstance from "/lib/axiosInstance";
import { IMenuItem } from "/models/types/MenuItem";
import { IMenuSection } from "/models/types/MenuSection";
import { IStore } from "/models/types/Store";

const useDeleteMenuItem = () => {
  const call = async (
    store: IStore,
    menuSection: IMenuSection,
    menuItem: IMenuItem
  ) => {
    const response = await axiosInstance.delete(
      `/api/store/${store._id}/menu/section/${menuSection._id}/item/${menuItem._id}`
    );
    return response;
  };
  return call;
};

export default useDeleteMenuItem;
