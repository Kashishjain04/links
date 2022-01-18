import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import clientPromise from "./mongoConnect";

export default async function handler(req, res, next) {
	const { authorization } = req.headers;
	if (!authorization) return res.status(401).json({ error: "Missing Authorization Header" });

	const token = authorization.replace("Bearer ", "");
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
