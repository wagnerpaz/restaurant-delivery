const sectionsPopulate = (append?: any) => {
  const populate = [
    {
      path: "items",
      populate: [
        {
          path: "composition",
          populate: [{ path: "ingredient" }],
        },
        { path: "additionals", populate: { path: "items.ingredient" } },
        { path: "sides", populate: { path: "menuItem" } },
      ],
    },
  ];
  if (append) {
    populate.push(append);
  }
  return {
    path: "sections",
    populate,
  };
};

export default sectionsPopulate;
