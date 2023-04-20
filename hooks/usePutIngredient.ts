import mongoose from "mongoose";

import axiosInstance from "/lib/axiosInstance";
import { IIngredient } from "/models/Ingredients";

const usePutIngredient = () => {
  const call = async (ingredient: IIngredient | IIngredient[]) => {
    const handleIngredient = async (ingredient: IIngredient) => {
      if (ingredient._id) {
        const response = await axiosInstance.put(
          `/api/ingredient/${ingredient._id}`,
          ingredient
        );
        return response.data;
      } else {
        const response = await axiosInstance.post(
          `/api/ingredient`,
          ingredient
        );
        return response.data;
      }
    };

    if (Array.isArray(ingredient)) {
      const ingredients = ingredient as IIngredient[];
      const promises = [];
      for (const ingredient of ingredients) {
        promises.push(handleIngredient(ingredient));
      }
      return await Promise.all(promises);
    } else {
      return await handleIngredient(ingredient);
    }
  };
  return call;
};

export default usePutIngredient;
