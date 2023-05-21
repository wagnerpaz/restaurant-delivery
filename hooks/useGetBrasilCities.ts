import axios from "redaxios";
import { useCallback } from "react";

const useGetBrasilCities = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const call = useCallback(async (idState: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_IBGE_API_URL}/v1/localidades/estados/${idState}/municipios`
      );
      return response.data.map((m) => m.nome);
    } catch (e) {
      return null;
    }
  }, []);
  return call;
};

export default useGetBrasilCities;
