import axiosInstance from "/lib/axiosInstance";
import { IIngredient } from "/models/Ingredients";
import { IStore } from "/models/Store";

const usePutStoreIngredients = () => {
  const call = async (store: IStore, ingredients: IIngredient[]) => {
    const response = await axiosInstance.put(
      `/api/store/${store._id}/ingredients`,
      ingredients
    );
    return response;
  };
  return call;
};

export default usePutStoreIngredients;
