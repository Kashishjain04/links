import Cookies from "cookies";
import Error from "next/error";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import LinksTable from "../../components/LinksTable";
import Navbar from "../../components/Navbar";
import { resetUser, setUser } from "../../redux/slices/userSlice";

const LinksPage = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {
		if (props.user) dispatch(setUser(props.user));
		else dispatch(resetUser());
	}, [props.user]);

	return (
		<div>
			<Head>
				<title>Links | Admin</title>
				<link rel="icon" href="/logo.png" />
			</Head>
			{props.error ? (
				<Error statusCode={props.error.code} title={props.error.title} />
			) : (
				<>
					<Navbar />
					<main className="pt-16 pb-2 px-4 bg-gray-100 min-h-screen grid place-items-center">
						<LinksTable links={props.links} />
					</main>
				</>
			)}
		</div>
	);
};

export default LinksPage;

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
		const links = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getUserLinks`, {
			method: "GET",
			headers: {
				cookie: `token=${cookies.get("token")}`,
			},
		}).then((res) => res.json());
		return { props: { links, user } };
	} catch (error) {
		return { props: { user: null, error: error.message || "Invalid Server Error", code: 500 } };
	}
}
