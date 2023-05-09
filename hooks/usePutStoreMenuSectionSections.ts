import axiosInstance from "/lib/axiosInstance";
import { IMenuSection } from "/models/types/MenuSection";
import { IStore } from "/models/types/Store";

const usePutStoreMenuSectionSections = () => {
  const call = async (store: IStore, menuSection: IMenuSection) => {
    if (menuSection._id) {
      const response = await axiosInstance.put(
        `/api/store/${store._id}/menu/section/${menuSection._id}`,
        menuSection
      );
      return response.data;
    } else {
      const response = await axiosInstance.post(
        `/api/store/${store._id}/menu/section`,
        menuSection
      );
      return response.data;
    }
  };
  return call;
};

export default usePutStoreMenuSectionSections;
