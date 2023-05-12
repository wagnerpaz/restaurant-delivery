const defaultToastError = (err) => {
  return {
    message: "Ocorreu um erro",
    description:
      err?.response?.data?.message || err?.message || JSON.stringify(err),
    type: "error",
  };
};
export default defaultToastError;
