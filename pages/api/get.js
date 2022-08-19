import clientPromise from "./middlewares/mongoConnect";

const handler = async (req, res) => {
	const { shortUrl } = req.query;
  const { analyticsObj } = JSON.parse(req.body);

	const client = await clientPromise,
		db = client.db(process.env.MONGODB_DB);

	const doc = await db.collection("links").findOneAndUpdate(
		{ short: shortUrl },
		{
			$push: {analytics: analyticsObj},
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
