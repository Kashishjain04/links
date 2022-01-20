import Cookies from "cookies";

export default async function handler(req, res) {
	const { token } = req.cookies;
	if (!token) return res.status(401).json({ error: "Unauthorized" });

	const cookies = new Cookies(req, res);

	cookies.set("token");

	return res.status(200).json({ message: "Logged out" });
}
