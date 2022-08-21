import Cookies from "cookies";
import Error from "next/error";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { resetUser, setUser } from "../redux/slices/userSlice";
import toast, { Toaster } from "react-hot-toast";

export default function Home(props) {
	const dispatch = useDispatch(),
		[loading, setLoading] = useState(false),
		[url, setUrl] = useState(""),
		[slug, setSlug] = useState(""),
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
		if (longUrl.startsWith(process.env.NEXT_PUBLIC_BASE_URL)) {
			toast.error("Destination leading to ∞ loop.");
			setLoading(false);
			return;
		}
		if (slug && (slug.contains(".") || slug.contains(" "))) {
			toast.error("Invalid customed slug.");
			setLoading(false);
			return;
		}

		fetch("/api/shorten", {
			method: "POST",
			body: JSON.stringify({ longUrl, customSlug: slug }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					toast.error(res.error);
				} else {
					setUrl(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.short);
					setReadOnly(true);
				}
			})
			.catch((err) => toast.error("Unexpected Error!"))
			.finally(() => setLoading(false));
	};

	const copyHandler = (e) => {
		e.preventDefault();
		navigator.clipboard.writeText(url);
		toast.success("Copied to clipboard!");
	};

	useEffect(() => {
		if (props.user) dispatch(setUser(props.user));
		else dispatch(resetUser());
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.user]);

	const inputForm = (
		<form
			onSubmit={shorten}
			className="mt-48 shadow-xl bg-white rounded-md border w-full max-w-xs md:max-w-3xl mx-auto flex items-center p-2 md:p-4 space-x-0 space-y-2 flex-col"
		>
			<input
				type="url"
				placeholder="URL Here..."
				className="text-lg md:text-lg flex-1 border p-2 rounded-md w-full"
				value={url}
				onChange={(e) => setUrl(e.target.value)}
				required
			/>
			<input
				type="text"
				maxLength="9"
				placeholder="Custom Slug (optional)"
				className="text-lg md:text-lg flex-1 border p-2 rounded-md w-full"
				value={slug}
				onChange={(e) => setSlug(e.target.value)}
			/>
			<button
				type="submit"
				className="bg-[#eb7f00] text-white text-lg md:text-lg font-medium p-2 rounded-md w-full"
			>
				{loading ? (
					<div className="mx-auto loader rounded-full border-2 border-t-2 sm:border-4 sm:border-t-4 border-t-white border-[#eb7f00] h-6 w-6 sm:h-8 sm:w-8" />
				) : (
					"Shorten"
				)}
			</button>
		</form>
	);

	const outputForm = (
		<form
			onSubmit={copyHandler}
			className="mt-48 shadow-xl bg-white rounded-md border w-full max-w-xs sm:max-w-3xl mx-auto flex items-center p-2 md:p-4 space-x-0 space-y-2 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row"
		>
			<input
				disabled
				type="url"
				placeholder="Short URL"
				className="text-lg md:text-lg flex-1 border p-2 rounded-md w-full md:w-auto cursor-not-allowed"
				value={url}
				onChange={(e) => {}}
				required
			/>
			<button
				type="submit"
				className="bg-[#eb7f00] text-white text-lg md:text-lg font-medium p-2 rounded-md w-full sm:w-28"
			>
				{loading ? (
					<div className="mx-auto loader rounded-full border-2 border-t-2 sm:border-4 sm:border-t-4 border-t-white border-[#eb7f00] h-6 w-6 sm:h-8 sm:w-8" />
				) : (
					"Copy URL"
				)}
			</button>
		</form>
	);

	return (
		<div>
			<Toaster position="bottom-center" reverseOrder={false} />
			<Head>
				<title>Links</title>
				<link rel="icon" href="/logo.png" />
			</Head>
			{props.error ? (
				<Error statusCode={props.error.code} title={props.error.title} />
			) : (
				<>
					<Navbar />
					<main className="pt-14 px-2 bg-gray-100 min-h-screen">
						{readOnly ? outputForm : inputForm}
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
