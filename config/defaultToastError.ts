import { UseToastOptions } from "@chakra-ui/react";

const defaultToastError = (err): UseToastOptions => {
  console.log(err);
  return {
    title: "Ocorreu um erro",
    description:
      err?.response?.data?.message || err?.message || JSON.stringify(err),
    status: "error",
  };
};
export default defaultToastError;
