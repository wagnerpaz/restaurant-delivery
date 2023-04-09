import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/Store";

const useGetStoreMenuSectionItems = () => {
  const call = async (store: IStore, sectionIndex: number) => {
    const response = await axiosInstance.get(
      `/api/store/${store._id}/menu-item/section/${sectionIndex}`
    );
    return response.data;
  };
  return call;
};

export default useGetStoreMenuSectionItems;
