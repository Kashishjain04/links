import clientPromise from "./middlewares/mongoConnect";
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

export default async (req, res) => {
	// An array with your links
	let links = [
    { url: "/", changefreq: "monthly", priority: 0.6 },
    { url: "/admin/auth", changefreq: "monthly", priority: 0.5 },
    { url: "/admin/links", changefreq: "daily", priority: 0.6 },
  ];

  // dynamically add links to the array
  const client = await clientPromise,
		db = client.db(process.env.MONGODB_DB);

	const docs = await db.collection("links").find().toArray();
  docs.forEach((doc) => {
    links.push({ url: `/${doc.short}`, changefreq: "daily", priority: 0.6 });
  })

	// Create a stream to write to
	const stream = new SitemapStream({ hostname: `https://${req.headers.host}` });

	res.writeHead(200, {
		"Content-Type": "application/xml",
	});

	// Return a promise that resolves with your XML string
	const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
		data.toString()
	);

  res.end(xmlString);
};
