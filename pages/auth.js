import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthPage = () => {
	const router = useRouter(),
		[loading, setLoading] = useState(true),
		[active, setActive] = useState(1);

	useEffect(() => {
		setLoading(true);
		const localToken = localStorage.getItem("token");
		if (localToken)
			return fetch("/api/auth/validate", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${localToken}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.user) {
						dispatch(login(res.user));
						router.push("/");
					}
					setLoading(false);
				})
				.catch(() => setLoading(false));
		else setLoading(false);
	}, []);

	return (
		<div>
			<Head>
				<title>Links | Login</title>
			</Head>
			{loading ? (
				<Loader />
			) : (
				<main className="bg-gray-100 min-h-screen grid place-items-center">
					<div>
						<div className="w-full flex items-center space-x-2 mb-6">
							<button
								onClick={() => setActive(1)}
								className={`px-4 py-2 rounded-md font-medium flex-1 border-2 ${
									active === 1 ? "bg-[#001A55] text-white" : "bg-white text-black"
								}`}
							>
								Login
							</button>
							<button
								onClick={() => setActive(2)}
								className={`px-4 py-2 rounded-md font-medium flex-1 border-2 ${
									active === 2 ? "bg-[#001A55] text-white" : "bg-white text-black"
								}`}
							>
								Signup
							</button>
						</div>
						{active === 1 ? <LoginForm /> : <SignupForm />}
					</div>
				</main>
			)}
		</div>
	);
};

export default AuthPage;
