import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";
import { selectUser, setUser } from "../../redux/slices/userSlice";
import isAuthenticated from "../../utils/isAuthenticated";

const LinksPage = () => {
	const router = useRouter(),
		dispatch = useDispatch(),
		user = useSelector(selectUser),
		[loading, setLoading] = useState(true),
		[links, setLinks] = useState([]);

	useEffect(() => {
		setLoading(true);
		isAuthenticated()
			.then((user) => {
				dispatch(setUser(user));
				setLoading(false);
			})
			.catch(() => router.push("/admin/auth"));
	}, []);

	useEffect(() => {
		if (user) {
			fetch("/api/getUserLinks", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.error) return console.log(res.error);
					setLinks(res);
				})
				.catch((err) => console.log(err));
		}
	}, [user]);

	return (
		<div>
			<Head>
				<title>Links | Admin</title>
				<link rel="icon" href="/logo.png" />
			</Head>
			{loading ? (
				<Loader />
			) : (
				<>
					<Navbar />
					<main className="bg-gray-100 min-h-screen grid place-items-center">
						<h1>Links Here</h1>
					</main>
				</>
			)}
		</div>
	);
};

export default LinksPage;
