import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/types/Store";
import { IMenuSection } from "/models/types/MenuSection";

const usePostStoreMenuSection = () => {
  const call = async (store: IStore, newMenuSection: IMenuSection) => {
    if (newMenuSection._id) {
      const response = await axiosInstance.put(
        `/api/store/${store._id}/menu/section/${newMenuSection._id}`,
        newMenuSection
      );
      return response.data;
    } else {
      const response = await axiosInstance.post(
        `/api/store/${store._id}/menu/section`,
        newMenuSection
      );
      return response.data;
    }
  };
  return call;
};

export default usePostStoreMenuSection;
