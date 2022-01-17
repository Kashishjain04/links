import clientPromise from "./middlewares/mongoConnect";
import shortid from "shortid";

const handler = async (req, res) => {
  const { longUrl } = JSON.parse(req.body);
  if (!longUrl) {
    res.status(400).json({ error: "Please provide a valid URL" });
  }
  const shortUrl = shortid.generate().toLowerCase();

  const client = await clientPromise,
    db = client.db("links");

  const doc = await db.collection(process.env.MONGODB_DB).findOneAndUpdate(
    { long: longUrl },
    {
      $currentDate: { lastAccessed: true },
      $inc: { timesAccessed: 1 },
    }
  );
  if (doc.value) {
    res.status(200).json({ short: doc.value.short, long: doc.value.long });
  } else {
    const doc = await db.collection(process.env.MONGODB_DB).insertOne({
      long: longUrl,
      short: shortUrl,
      created: new Date(),
      lastAccessed: 0,
      timesAccessed: 0,
    });
    if (doc.acknowledged)
      res.status(200).json({ short: shortUrl, long: longUrl });
    else res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
