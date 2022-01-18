import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../redux/slices/userSlice";

const Navbar = () => {
	const dispatch = useDispatch(),
		router = useRouter(),
		user = useSelector(selectUser);

	const logoutHandler = () => {
		localStorage.removeItem("token");
		dispatch(logout());
		router.replace("/auth");
	};

	return (
		<div className="h-14 px-4 w-screen bg-[#B9D6F8] fixed top-0 flex items-center justify-between shadow-md">
			<h1 className="text-center text-2xl font-medium">Links</h1>
			{user ? (
				<button className="bg-white rounded-md py-1 px-3 shadow-sm" onClick={logoutHandler}>
					Logout
				</button>
			) : (
				<button
					className="bg-white rounded-md py-1 px-3 shadow-sm"
					onClick={() => router.push("/auth")}
				>
					Login/Signup
				</button>
			)}
		</div>
	);
};

export default Navbar;
