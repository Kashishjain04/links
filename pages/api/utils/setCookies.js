import Cookies from "cookies";

export default async function setCookies(req, res, cookieName, payload, expiry) {
	const cookies = new Cookies(req, res, {secure: true});
	try {
		cookies.set(cookieName, payload, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: expiry,
			overwrite: true,
		});
	} catch (error) {
		console.log(error);
	}
}
