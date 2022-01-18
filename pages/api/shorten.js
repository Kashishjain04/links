import clientPromise from "./middlewares/mongoConnect";
import shortid from "shortid";
import runMiddleware from "./utils/runMiddleware";
import requireLogin from "./middlewares/requireLogin";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
	await runMiddleware(req, res, requireLogin);
	if (!req.user) return res.status(401).json({ error: "Not logged in" });
	const { longUrl } = JSON.parse(req.body);
	if (!longUrl) {
		res.status(400).json({ error: "Please provide a valid URL" });
	}
	const shortUrl = shortid.generate().toLowerCase();

	const client = await clientPromise,
		db = client.db(process.env.MONGODB_DB);

	const doc = await db.collection("links").findOneAndUpdate(
		{ long: longUrl },
		{
			$currentDate: { lastAccessed: true },
			$inc: { timesAccessed: 1 },
		}
	);
	if (doc.value) {
		return res.status(200).json({ short: doc.value.short, long: doc.value.long });
	} else {
		const doc = await db.collection("links").insertOne({
			long: longUrl,
			short: shortUrl,
			created: new Date(),
			createdBy: { _id: ObjectId(req.user._id), email: req.user.email },
			lastAccessed: 0,
			timesAccessed: 0,
		});

		if (doc.acknowledged) {
			await db
				.collection("users")
				.updateOne({ _id: ObjectId(req.user._id) }, { $push: { links: doc.insertedId } });
        
			return res.status(200).json({ short: shortUrl, long: longUrl });
		} else return res.status(500).json({ error: "Something went wrong" });
	}
};

export default handler;
