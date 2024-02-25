import Error from "next/error";
import { getIp } from "./api/utils/utility";

const ShortUrl = (props) => {
	return props.error ? (
		<Error statusCode={404} title="Link not found" />
	) : (
		<Error statusCode={"Loading"} title="Please Wait" />
	);
};

export default ShortUrl;

export async function getServerSideProps(context) {
	const { shortUrl } = context.params;

	const ip = getIp(context.req);

	const geolocation = await fetch(
		`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.GEOLOCATION_API_ID}&ip=${ip}`
	)
		.then((res) => res.json())
		.then((res) => res)
		.catch(() => {});

	const useragent = await fetch(
		`https://api.ipgeolocation.io/user-agent?apiKey=${process.env.GEOLOCATION_API_ID}&ip=${ip}`
	)
		.then((res) => res.json())
		.then((res) => res)
		.catch(() => {});

	const analyticsObj = {
		timestamp: new Date(),
		ip: geolocation.ip,
		country: geolocation.country_name,
		region: geolocation.state_prov,
		timeZone: geolocation.time_zone,
		deviceType: useragent.device?.type,
		deviceOS: useragent.operatingSystem?.name,
	};

	if (shortUrl)
		return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get?shortUrl=${shortUrl}`, {
			method: "POST",
			body: JSON.stringify({ analyticsObj }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) return { props: { error: res.error } };

				const prefix1 = "http://",
					prefix2 = "https://";
				let longUrl = res.long;
				if (
					longUrl.substr(0, prefix1.length) !== prefix1 &&
					longUrl.substr(0, prefix2.length) !== prefix2
				) {
					longUrl = prefix1 + longUrl;
				}
				return { redirect: { permanent: true, destination: longUrl } };
			})
			.catch((error) => ({ props: { error: error.message } }));

	return {
		props: {},
	};
}
