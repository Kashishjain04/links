import Cookies from "cookies";
import Error from "next/error";
import Head from "next/head";
import { useState } from "react";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";

const AuthPage = (props) => {
	const [active, setActive] = useState(1);

	return (
		<div>
			<Head>
				<title>Links | Login</title>
				<link rel="icon" href="/logo.png" />
			</Head>
			{props.error ? (
				<Error statusCode={props.error.code} title={props.error.title} />
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

export async function getServerSideProps({ req, res }) {
	const cookies = new Cookies(req, res);
	try {
		const isAuth = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/validate`, {
			method: "GET",
			headers: {
				cookie: `token=${cookies.get("token")}`,
			},
		});
		const { user } = await isAuth.json();
		if (user) return { redirect: { destination: "/" } };
		return { props: {} };
	} catch (error) {
		return { props: { error: error.message || "Invalid Server Error", code: 500 } };
	}
}

export default AuthPage;
