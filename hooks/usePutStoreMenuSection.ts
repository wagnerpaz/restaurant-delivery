import axiosInstance from "/lib/axiosInstance";
import { IMenuSection, IStore } from "/models/Store";

const usePostStoreMenuSection = () => {
  const call = async (
    store: IStore,
    newMenuSection: IMenuSection,
    sectionIndex?: number[]
  ) => {
    if (newMenuSection._id) {
      const response = await axiosInstance.put(
        `/api/store/${store._id}/menu/section/${sectionIndex}`,
        newMenuSection
      );
      return response;
    } else {
      const response = await axiosInstance.post(
        `/api/store/${store._id}/menu/section`,
        newMenuSection
      );
      return response;
    }
  };
  return call;
};

export default usePostStoreMenuSection;
