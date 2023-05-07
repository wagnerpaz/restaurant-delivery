const sectionsPopulate = (append?: any) => {
  const populate = [
    {
      path: "items",
      // match: { itemType: { $ne: "ingredient" } },
      select: "-additionals",
      populate: [
        {
          path: "composition",
          populate: [{ path: "ingredient" }],
        },
        // { path: "customizeTemplateMenuItem" },
        // { path: "additionals", populate: { path: "items.ingredient" } },
        // { path: "sides", populate: { path: "menuItem" } },
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
