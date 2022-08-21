import clientPromise from "./middlewares/mongoConnect";
import shortid from "shortid";
import runMiddleware from "./utils/runMiddleware";
import requireLogin from "./middlewares/requireLogin";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
	// check if request is authenticated
	await runMiddleware(req, res, requireLogin);
	if (!req.user) return res.status(401).json({ error: "Not logged in" });

	// request body validation
	const { longUrl, customSlug } = JSON.parse(req.body);
	if (!longUrl) {
		return res.status(400).json({ error: "Please provide a valid URL" });
	}

	//initialize db
	const client = await clientPromise,
		db = client.db(process.env.MONGODB_DB);

	// custom slug validation
	if(customSlug){
		if(customSlug.length > 9){
			return res.status(400).json({ error: "Custom slug must be 9 characters or less" });
		}
		const slugExists = await db.collection("links").findOne({ short: customSlug });
		if(slugExists){
			return res.status(400).json({ error: "Custom slug already exists" });
		}
	}
	
	// generate short url
	const shortUrl = customSlug || shortid.generate().toLowerCase();

	// check if url already exists
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
		// insert new url
		const doc = await db.collection("links").insertOne({
			long: longUrl,
			short: shortUrl,
			created: new Date(),
			createdBy: { _id: ObjectId(req.user._id), email: req.user.email, name: req.user.name },
			lastAccessed: 0,
			timesAccessed: 0,
			analytics: [],
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
