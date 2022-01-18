import Error from "next/error";

const ShortUrl = (props) => {
	console.log(props);

	return props.error ? (
		<Error statusCode={404} title="Link not found" />
	) : (
		<Error statusCode={"Loading"} title="Please Wait" />
	);
};

export default ShortUrl;

export async function getServerSideProps(context) {
	const { shortUrl } = context.params;

	if (shortUrl)
		return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get?shortUrl=${shortUrl}`, {
			method: "GET",
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
