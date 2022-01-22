import clientPromise from "./middlewares/mongoConnect";
import runMiddleware from "./utils/runMiddleware";
import requireLogin from "./middlewares/requireLogin";

export default async function handler(req, res) {
	await runMiddleware(req, res, requireLogin);
	if (!req.user) return res.status(401).json({ error: "Not logged in" });

	const client = await clientPromise,
		db = client.db(process.env.MONGODB_DB);

	const docs = await db.collection("links").find({ "createdBy._id": req.user._id }).toArray();
	if (docs) return res.status(200).json(docs);
    return res.status(500).json({ error: "Could not get links" });
}
