export const getAccessibleColor = (hex: string) => {
  let color = hex.replace(/#/g, "");
  // rgb values
  var r = parseInt(color.slice(0, 2), 16);
  var g = parseInt(color.slice(2, 4), 16);
  var b = parseInt(color.slice(4, 6), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};
