import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import clientPromise from "../middlewares/mongoConnect";

export default async function handler(req, res) {
    const { authorization } = req.headers;
	if (!authorization) return res.status(401).json({ error: "Missing Authorization Header" });

	const token = authorization.replace("Bearer ", "");
	return jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
		if (err) return res.status(401).json({ error: "Invalid Token" });
		const { _id } = payload;
		const client = await clientPromise,
			db = client.db(process.env.MONGODB_DB);
		const user = await db.collection("users").findOne({ "_id": ObjectId(_id) }, { projection: { password: 0 } });
		if(user) return res.status(200).json({ user });
		else return res.status(404).json({ error: "User not found" });
	});
}