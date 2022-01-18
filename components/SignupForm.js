import { useRouter } from "next/router";
import { useState } from "react";

const SignupForm = () => {
	const router = useRouter(),
	 [name, setName] = useState(""),
		[email, setEmail] = useState(""),
		[password, setPassword] = useState("");

	const signupHandler = (e) => {
		e.preventDefault();
		if (!email || !password || !name) return alert("Please fill all the fields");
		fetch("/api/auth/signup", {
			method: "POST",
			body: JSON.stringify({ email, password, name }),
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
			onSubmit={signupHandler}
			className="sm:w-[400px] flex flex-col space-y-2 bg-white rounded-md p-4 border-2"
		>
			<div className="flex items-center justify-between">
				<label className="sm:w-1/4 sm:block hidden" htmlFor="name">
					Name:
				</label>
				<input
					className="sm:w-3/4 p-2 rounded-md border"
					name="name"
					type="text"
					placeholder="Full Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</div>
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
				Signup
			</button>
		</form>
	);
};

export default SignupForm;
