import { useRouter } from "next/router";
import { useState } from "react";

const LoginForm = () => {
	const router = useRouter(),
		[email, setEmail] = useState(""),
		[password, setPassword] = useState("");

	const loginHandler = (e) => {
		e.preventDefault();
		if (!email || !password) return alert("Please fill all the fields");
		fetch("/api/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) return console.log(res.errer);
				localStorage.setItem("token", res.token);
				router.push("/");
			});
	};

	return (
		<form
			onSubmit={loginHandler}
			className="sm:w-[400px] flex flex-col space-y-2 bg-white rounded-md p-4 border-2"
		>
			<div className="flex items-center justify-between">
				<label className="sm:w-1/4 sm:block hidden" htmlFor="email">
					Email:
				</label>
				<input
					className="sm:w-3/4 p-2 rounded-md border"
					name="email"
					type="email"
					placeholder="Email Id"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div className="flex items-center justify-between">
				<label className="w-1/4 sm:block hidden" htmlFor="password">
					Password:
				</label>
				<input
					className="sm:w-3/4 p-2 rounded-md border"
					name="password"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<button
				type="submit"
				style={{ marginTop: "1rem" }}
				className="w-full rounded-md bg-[#eb7f00] text-white font-medium p-2"
			>
				Login
			</button>
		</form>
	);
};

export default LoginForm;