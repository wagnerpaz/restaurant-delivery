export default function serializeJson(obj: any) {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return JSON.parse(JSON.stringify(obj));
}
