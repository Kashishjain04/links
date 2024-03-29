import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { resetUser, selectUser } from "../redux/slices/userSlice";

const Navbar = () => {
	const dispatch = useDispatch(),
		router = useRouter(),
		user = useSelector(selectUser),
		[expanded, setExpanded] = useState(false);

	const logoutHandler = () => {
		fetch("/api/auth/logout", {
			method: "GET",
		})
			.then(() => {
				dispatch(resetUser());
				router.replace("/admin/auth");
			})
			.catch(() => alert("Unexpected error occured"));
	};

	const dropdown = (
		<Modal
			style={{ zIndex: 49 }}
			BackdropProps={{ style: { backgroundColor: "transparent" } }}
			open={expanded}
			onClose={() => setExpanded(false)}
		>
			<div
				className={`shadow-md absolute top-14 border-t md:right-2 bg-[#B9D6F8] p-4 w-full md:w-64 rounded-b-lg flex-grow ${
					expanded ? "block" : "hidden"
				}`}
			>
				<div className="text-sm text-black">
					<div
						onClick={() => router.push("/admin/links")}
						className="w-full block mt-1 p-2 rounded cursor-pointer hover:text-white hover:bg-[#001A55] transition duration-100"
					>
						My Links
					</div>
					<p
						onClick={() => {
							setExpanded(false);
							logoutHandler();
						}}
						className="w-full block mt-1 p-2 rounded cursor-pointer hover:text-white hover:bg-[#001A55] transition duration-100"
					>
						Logout
					</p>
				</div>
			</div>
		</Modal>
	);

	return (
		<>
			<div className="z-10 h-14 px-4 w-screen bg-[#B9D6F8] fixed top-0 flex items-center justify-between shadow-md">
				<h1
					onClick={() => router.push("/")}
					className="text-center text-2xl font-medium cursor-pointer"
				>
					Links
				</h1>
				{user ? (
					<IconButton aria-label="profile" onClick={() => setExpanded((prev) => !prev)}>
						<Avatar src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.name}`} alt="avatar" />
					</IconButton>
				) : (
					<button
						className="bg-white rounded-md py-1 px-3 shadow-sm"
						onClick={() => router.push("/admin/auth")}
					>
						Login/Signup
					</button>
				)}
			</div>
			{dropdown}
		</>
	);
};

export default Navbar;
