import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/types/Store";

const useGetMenuItemsAdditionals = () => {
  const call = async (store: IStore, menuItem: IMenuItem) => {
    const response = await axiosInstance.get(
      `/api/store/${store._id}/menu/item/${menuItem._id}/additionals`
    );
    return response.data;
  };
  return call;
};

export default useGetMenuItemsAdditionals;
