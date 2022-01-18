import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "../middlewares/mongoConnect";

export default async function handler(req, res) {
	const { email, password, name } = JSON.parse(req.body);
	if (!email || !password || !name) return res.status(422).json({ error: "Missing fields" });

	const client = await clientPromise,
		db = client.db(process.env.MONGODB_DB);

	const user = await db.collection("users").findOne({ email });

	if (user) return res.status(422).json({ error: "User already exists" });

	const hashedPassword = await bcrypt.hash(password, 12);

	try {
		const doc = await db
			.collection("users")
			.insertOne({ name, email, password: hashedPassword, links: [] });
		if (doc.acknowledged) {
			const token = jwt.sign({ _id: doc.insertedId }, process.env.JWT_SECRET);
			return res.status(200).json({
				token,
				user: { name, email, links: [] },
			});
		} else {
			return res.status(500).json({ error: "Something went wrong" });
		}
	} catch (err) {
		return res.status(500).json({ error: "Something went wrong" });
	}
}
