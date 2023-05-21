import axios from "redaxios";
import debounce from "lodash.debounce";
import { useCallback } from "react";

import { ILocation } from "/models/types/Store";

const useGetBrasilCep = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const call = useCallback(async (cep: string) => {
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
  }, []);
  return call;
};

export default useGetBrasilCep;
