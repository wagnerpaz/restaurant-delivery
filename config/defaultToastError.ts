const defaultToastError = (err) => {
  return {
    message: "Ocorreu um erro",
    // description:
    //   err?.response?.data?.message || err?.message || JSON.stringify(err),
    status: "error",
  };
};
export default defaultToastError;
