import axiosInstance from "/lib/axiosInstance";
import { IMenuSection, IStore } from "/models/types/Store";

const useDeleteStoreMenuSection = () => {
  const call = async (store: IStore, sectionIndex: number[]) => {
    const response = await axiosInstance.delete(
      `/api/store/${store._id}/menu/section/${sectionIndex}`
    );
    return response;
  };
  return call;
};

export default useDeleteStoreMenuSection;
