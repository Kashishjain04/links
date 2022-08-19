export const getIp = (req) => {
  let ip;
	// const { req } = context;
  // console.log(req.headers)
  // console.log(req.connection)

	if (req.headers["x-forwarded-for"]) {
		ip = req.headers["x-forwarded-for"].split(",")[0];
	} else if (req.headers["x-real-ip"]) {
		ip = req.connection.remoteAddress;
	} else {
		ip = req.connection.remoteAddress;
	}
  return ip;
};