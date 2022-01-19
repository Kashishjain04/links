export default async function isAuthenticated() {
	return new Promise((resolve, reject) => {
		const localToken = localStorage.getItem("token");
		if (!localToken) return reject("Token Not Found");
		fetch("/api/auth/validate", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localToken}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) return reject("Invalid Token");
				resolve({...res.user, token: localToken});
			})
			.catch(() => reject("Unknow Error"));
	});
}
