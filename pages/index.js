import Cookies from "cookies";
import Error from "next/error";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { resetUser, setUser } from "../redux/slices/userSlice";

export default function Home(props) {
	const dispatch = useDispatch(),
		[loading, setLoading] = useState(false),
		[url, setUrl] = useState(""),
		[readOnly, setReadOnly] = useState(false);

	const shorten = (e) => {
		e.preventDefault();
		setLoading(true);
		const prefix1 = "http://",
			prefix2 = "https://";
		let longUrl = url;
		if (longUrl.substr(0, prefix1.length) !== prefix1 && longUrl.substr(0, prefix2.length) !== prefix2) {
			longUrl = prefix1 + longUrl;
		}
		fetch("/api/shorten", {
			method: "POST",
			body: JSON.stringify({ longUrl }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					alert(res.error);
				}
				setUrl(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.short);
				setReadOnly(true);
			})
			.catch((err) => console.log(err.message))
			.finally(() => setLoading(false));
	};

	const copyHandler = (e) => {
		e.preventDefault();
		navigator.clipboard.writeText(url);
	};

	useEffect(() => {
		if (props.user) dispatch(setUser(props.user));
		else dispatch(resetUser());
	}, [props.user]);

	return (
		<div>
			<Head>
				<title>Links</title>
				<link rel="icon" href="/logo.png" />
			</Head>
			{props.error ? (
				<Error statusCode={props.error.code} title={props.error.title} />
			) : (
				<>
					<Navbar />
					<main className="pt-14 bg-gray-100 min-h-screen">
						<form
							onSubmit={readOnly ? copyHandler : shorten}
							className="mt-48 shadow-xl bg-white rounded-md border w-full max-w-xs sm:max-w-3xl mx-auto flex items-center p-2 md:p-4 space-x-0 space-y-2 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row"
						>
							<input
								disabled={readOnly}
								type="url"
								placeholder="URL Here..."
								className={
									"text-lg md:text-lg flex-1 border p-2 rounded-md w-full sm:w-auto" +
									(readOnly && "cursor-not-allowed")
								}
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								required
							/>
							<button
								type="submit"
								className="bg-[#eb7f00] text-white text-lg md:text-lg font-medium p-2 rounded-md w-full sm:w-28"
							>
								{loading ? (
									<div className="mx-auto loader rounded-full border-2 border-t-2 sm:border-4 sm:border-t-4 border-t-white border-[#eb7f00] h-6 w-6 sm:h-8 sm:w-8" />
								) : readOnly ? (
									"Copy URL"
								) : (
									"Shorten"
								)}
							</button>
						</form>
					</main>
				</>
			)}
		</div>
	);
}

export async function getServerSideProps({ req, res }) {
	const cookies = new Cookies(req, res, { secure: true });
	try {
		const isAuth = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/validate`, {
			method: "GET",
			headers: {
				cookie: `token=${cookies.get("token")}`,
			},
		});
		const { user } = await isAuth.json();
		if (!user) return { redirect: { destination: "/admin/auth" } };
		return { props: { user } };
	} catch (error) {
		return { props: { user: null, error: error.message || "Invalid Server Error", code: 500 } };
	}
}
