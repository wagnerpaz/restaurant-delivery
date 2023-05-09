import axios from "axios";

export default async function revalidateCall(path: string) {
  const baseUrl = process.env.VERCEL_URL
    ? "https://" + process.env.VERCEL_URL
    : "http://localhost:3000";

  return await axios(`${baseUrl}/api/revalidate`, {
    params: { secret: process.env.REVALIDATION_SECRET_KEY, path },
  });
}
