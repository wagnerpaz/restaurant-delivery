import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/Store";

const useGetMenuItemsTrash = (store: IStore) => {
  const call = async () => {
    const response = await axiosInstance.get(
      `/api/store/${store._id}/menu/item/trash`
    );
    return response.data;
  };
  return call;
};

export default useGetMenuItemsTrash;
