import axiosInstance from "/lib/axiosInstance";
import { IMenuSection, IStore } from "/models/types/Store";

const usePutStoreMenuSectionSections = () => {
  const call = async (
    store: IStore,
    sectionIndex: number[],
    newMenuSection: IMenuSection
  ) => {
    const response = await axiosInstance.post(
      `/api/store/${store._id}/menu/section/${sectionIndex}/section`,
      newMenuSection
    );
    return response.data;
  };
  return call;
};

export default usePutStoreMenuSectionSections;
