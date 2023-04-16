import axios from "axios";
import debounce from "lodash.debounce";
import { useCallback } from "react";

import { ILocation } from "/models/Store";

const useGetBrasilCep = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const call = useCallback(async (cep: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BRASIL_API_URL}/cep/v2/${cep}`
      );
      const { state, city, neighborhood, street: address } = response.data;
      return {
        postalCode: cep,
        state,
        city,
        neighborhood,
        address,
      } as ILocation;
    } catch (e) {
      return null;
    }
  }, []);
  return call;
};

export default useGetBrasilCep;
