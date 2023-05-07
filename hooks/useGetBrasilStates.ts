import axios from "axios";
import { useCallback } from "react";

import { ILocation } from "/models/types/Store";

const useGetBrasilStates = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const call = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_IBGE_API_URL}/v1/localidades/estados`
      );
      return response.data.map(({ id, sigla }) => ({
        id,
        sigla,
      }));
    } catch (e) {
      return null;
    }
  }, []);
  return call;
};

export default useGetBrasilStates;
