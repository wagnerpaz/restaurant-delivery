import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/types/Store";

const useGetStoreIngredients = () => {
  const call = async (store: IStore) => {
    const response = await axiosInstance.get(
      `/api/store/${store._id}/ingredients`
    );
    return response.data;
  };
  return call;
};

export default useGetStoreIngredients;
