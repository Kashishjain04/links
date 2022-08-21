import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "cookies";
import Error from "next/error";
import Head from "next/head";
import LinkDetails from "../../components/LinkDetails";
import LinksTableBG from "../../components/LinksTableBG";
import LinksTableSM from "../../components/LinksTableSM";
import Navbar from "../../components/Navbar";
import { resetUser, setUser } from "../../redux/slices/userSlice";

const LinksPage = (props) => {
	const dispatch = useDispatch(),
		[activeLink, setActiveLink] = useState(0);

	useEffect(() => {
		if (props.user) dispatch(setUser(props.user));
		else dispatch(resetUser());
		//eslint-disable-next-line react-hooks/exhaustive-deps
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
					{props.links?.length ? (
						<main className="px-4 md:px-0 pt-16 bg-gray-100 min-h-screen flex flex-col md:flex-row">
							<LinksTableSM
								activeLink={activeLink}
								setActiveLink={setActiveLink}
								links={props.links}
								className="md:hidden"
							/>
							<LinksTableBG
								activeLink={activeLink}
								setActiveLink={setActiveLink}
								className="hidden md:block md:flex-[0.4] lg:flex-[0.3] h-[90vh]"
								links={props.links}
							/>
							<p className="md:hidden w-screen h-0.5 -mx-4 mt-4 mb-2 bg-gray-200" />
							<LinkDetails
								link={props.links[activeLink]}
								className="h-[90vh] overflow-y-scroll flex-1 md:py-4 md:px-8"
							/>
						</main>
					) : (
						<Error statusCode={403} title="No Links Found" />
					)}
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
		let links = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getUserLinks`, {
			method: "GET",
			headers: {
				cookie: `token=${cookies.get("token")}`,
			},
		}).then((res) => res.json());
		return { props: { links: links.reverse(), user } };
	} catch (error) {
		return { props: { user: null, error: error.message || "Invalid Server Error", code: 500 } };
	}
}
