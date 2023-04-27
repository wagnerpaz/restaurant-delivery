import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "/models/User";

async function user(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { locations } = req.body;

  if (req.method === "PUT") {
    const found = await User.findById(session.user?.id);
    Object.assign(found, { locations });
    found.save();
    res.status(200).json(found.toObject());
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }

  res.json({ message: "User updated" });
}

export default user;
