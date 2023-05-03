import upload from "/middlewares/api/upload";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = upload(["file"], async (req, res, results) => {
  res.status(200).json({ url: results["file"].toString() });
});

export default handler;
