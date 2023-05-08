const defaultToastError = (err) => {
  return {
    title: "Ocorreu um erro",
    description:
      err?.response?.data?.message || err?.message || JSON.stringify(err),
    status: "error",
  };
};
export default defaultToastError;
