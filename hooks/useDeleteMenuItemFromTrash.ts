import axiosInstance from "/lib/axiosInstance";
import { IMenuItem } from "/models/MenuItem";
import { IStore } from "/models/Store";

const useDeleteMenuItemFromTrash = (store: IStore) => {
  const call = async (menuItem: IMenuItem) => {
    const response = await axiosInstance.delete(
      `/api/store/${store._id}/menu/item/${menuItem._id}`
    );
    return response;
  };
  return call;
};

export default useDeleteMenuItemFromTrash;
