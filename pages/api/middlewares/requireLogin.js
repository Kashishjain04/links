import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import clientPromise from "./mongoConnect";

export default async function handler(req, res, next) {
	const {token} = req.cookies;
	if (!token) return res.status(401).json({ error: "Unauthorized" });
	jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
		if (err) return res.status(401).json({ error: "Invalid Token" });
		const { _id } = payload;
		const client = await clientPromise,
			db = client.db(process.env.MONGODB_DB);
		const user = await db.collection("users").findOne({ "_id": ObjectId(_id) }, { projection: { password: 0 } });
		req.user = user;
		next();
	});
}
