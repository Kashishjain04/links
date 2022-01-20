import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "../middlewares/mongoConnect";
import setCookies from "../utils/setCookies";

export default async function handler(req, res) {
	const { email, password } = JSON.parse(req.body);
	if (!email || !password) return res.status(422).json({ error: "Missing fields" });

	const client = await clientPromise,
		db = client.db(process.env.MONGODB_DB);

	const user = await db.collection("users").findOne({ email });

	if (!user) return res.status(422).json({ error: "Invalid Email / Password" });

	try {
		const matched = await bcrypt.compare(password, user.password);
		if (matched) {
			const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
			const userDoc = {
				email: user.email,
				name: user.name,
			};
			setCookies(req, res, "token", token, 1000 * 60 * 60 * 24 * 28);
			return res.status(200).json({ user: userDoc });
		} else return res.status(422).json({ error: "Invalid Email / Password" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Something went wrong" });
	}
}
