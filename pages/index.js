import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { login } from "../redux/slices/userSlice";

export default function Home() {
	const dispatch = useDispatch(),
		[loading, setLoading] = useState(true),
		[url, setUrl] = useState(""),
		[readOnly, setReadOnly] = useState(false),
		router = useRouter();

	const shorten = () => {
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
				setUrl(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.short);
				setReadOnly(true);
			})
			.catch((err) => console.log(err.message));
	};

	const copyHandler = () => {
		navigator.clipboard.writeText(url);
	};

	useEffect(() => {
		setLoading(true);
		const localToken = localStorage.getItem("token");
		if (!localToken) return router.replace("/auth");
		fetch("/api/auth/validate", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localToken}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) return router.replace("/auth");
				dispatch(login(res.user));
				setLoading(false);
			})
			.catch(() => router.replace("/auth"));
	}, []);

	return (
		<div>
			<Head>
				<title>Links</title>
				<link rel="icon" href="/logo.png" />
			</Head>
			{loading ? (
				<Loader />
			) : (
				<>
					<Navbar />
					<main className="pt-14 bg-gray-100 min-h-screen px-4 grid place-items-center">
						<div className="shadow-xl bg-white rounded-md border w-full max-w-3xl mx-auto flex items-center p-2 md:p-4 space-x-0 space-y-2 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row">
							<input
								disabled={readOnly}
								type="url"
								placeholder="URL Here..."
								className={
									"text-sm md:text-lg flex-1 border p-2 rounded-md w-full sm:w-auto" +
									(readOnly && "cursor-not-allowed")
								}
								value={url}
								onChange={(e) => setUrl(e.target.value)}
							/>
							<button
								onClick={readOnly ? copyHandler : shorten}
								className="bg-[#eb7f00] text-white text-sm md:text-lg font-medium p-2 rounded-md w-full sm:w-auto"
							>
								{readOnly ? "Copy URL" : "Shorten"}
							</button>
						</div>
					</main>
				</>
			)}
		</div>
	);
}
