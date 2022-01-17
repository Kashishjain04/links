import clientPromise from "./middlewares/mongoConnect";

const handler = async (req, res) => {
  const { shortUrl } = req.query;

  const client = await clientPromise,
    db = client.db("links");
  const doc = await db.collection(process.env.MONGODB_DB).findOneAndUpdate(
    { short: shortUrl },
    {
      $currentDate: { lastAccessed: true },
      $inc: { timesAccessed: 1 },
    }
  );
  if (doc.value) {
    res.status(200).json({ short: shortUrl, long: doc.value.long });
  } else {
    res.status(404).json({ error: "Not found" });
  }
};

export default handler;
