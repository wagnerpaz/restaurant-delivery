import mongoose from "mongoose";

import axiosInstance from "/lib/axiosInstance";
import { IIngredient } from "/models/Ingredients";

const usePutIngredient = () => {
  const call = async (ingredient: IIngredient | IIngredient[]) => {
    const handleIngredient = (ingredient: IIngredient) => {
      if (ingredient._id) {
        return axiosInstance.put(
          `/api/ingredient/${ingredient._id}`,
          ingredient
        );
      } else {
        return axiosInstance.post(`/api/ingredient`, ingredient);
      }
    };

    if (Array.isArray(ingredient)) {
      const ingredients = ingredient as IIngredient[];
      const promises = [];
      for (const ingredient of ingredients) {
        promises.push(handleIngredient(ingredient));
      }
      return await Promise.all(ingredients);
    } else {
      return await handleIngredient(ingredient);
    }
  };
  return call;
};

export default usePutIngredient;
