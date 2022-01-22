import clientPromise from "./middlewares/mongoConnect";
import runMiddleware from "./utils/runMiddleware";
import requireLogin from "./middlewares/requireLogin";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
	const { _id } = JSON.parse(req.body);
	if (!_id) return res.status(400).json({ error: "No id provided" });

	await runMiddleware(req, res, requireLogin);
	if (!req.user) return res.status(401).json({ error: "Not logged in" });

	const client = await clientPromise,
		db = client.db(process.env.MONGODB_DB);

	const response = await db
		.collection("links")
		.deleteOne({ _id: ObjectId(_id), "createdBy._id": req.user._id });

	if (response.deletedCount > 0) {
		res.status(200).json({ message: "Deleted Successfully" });
	} else {
		res.status(404).json({ error: "Not found" });
	}
};

export default handler;
