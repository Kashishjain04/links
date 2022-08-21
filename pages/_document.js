import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="description" content="Links manager app for kjdev.tech, encode larger links and track their clicks at one place." />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
