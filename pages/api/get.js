import clientPromise from "./middlewares/mongoConnect";
import { getIp } from "./utils/utility";

const handler = async (req, res) => {
	const { shortUrl } = req.query;

  const ip = getIp(req)

  console.log(ip);

	const geolocation = await fetch(
		`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.GEOLOCATION_API_ID}&ip=${ip}`
	)
		.then((res) => res.json())
		.then((res) => res)
		.catch((err) => console.log(err));

	const analyticsObj = {
		timestamp: new Date(),
		ip: geolocation.ip,
		country: geolocation.country_name,
		region: geolocation.state_prov,
		timeZone: geolocation.time_zone,
	};

	const client = await clientPromise,
		db = client.db(process.env.MONGODB_DB);

	const doc = await db.collection("links").findOneAndUpdate(
		{ short: shortUrl },
		{
			$push: {analytics: analyticsObj},
			$currentDate: { lastAccessed: true },
			$inc: { timesAccessed: 1 },
		}
	);
	if (doc.value) {
		res.status(200).json({ short: shortUrl, long: doc.value.long });
	} else {
		res.status(404).json({ error: "Not found" });
	}
};

export default handler;
