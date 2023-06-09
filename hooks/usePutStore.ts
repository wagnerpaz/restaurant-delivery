import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/types/Store";

const usePutStore = () => {
  const call = async (store: IStore) => {
    if (store._id) {
      const response = await axiosInstance.put(
        `/api/store/${store._id}`,
        store
      );
      return response.data;
    } else {
      const response = await axiosInstance.post(`/api/store`, store);
      return response.data;
    }
  };
  return call;
};

export default usePutStore;
