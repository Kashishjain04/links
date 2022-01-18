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
		[shortLoading, setShortLoading] = useState(false),
		[url, setUrl] = useState(""),
		[readOnly, setReadOnly] = useState(false),
		router = useRouter();

	const shorten = (e) => {
		e.preventDefault();
		setShortLoading(true);
		const prefix1 = "http://",
			prefix2 = "https://";
		let longUrl = url;
		if (longUrl.substr(0, prefix1.length) !== prefix1 && longUrl.substr(0, prefix2.length) !== prefix2) {
			longUrl = prefix1 + longUrl;
		}
		fetch("/api/shorten", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({ longUrl }),
		})
			.then((res) => res.json())
			.then((res) => {
				if(res.error){
					alert(res.error);
				}
				setUrl(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.short);
				setReadOnly(true);
			})
			.catch((err) => console.log(err.message))
			.finally(() => setShortLoading(false));
	};

	const copyHandler = (e) => {
		e.preventDefault();
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
								{shortLoading ? (
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
