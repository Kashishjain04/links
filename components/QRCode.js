import { useState } from "react";
import DownloadIcon from "@heroicons/react/outline/DownloadIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { saveAs } from "file-saver";

const QRCode = ({ showQR, setShowQR, url }) => {
	const [imageLoaded, setImageLoaded] = useState(false);

	const downloadQR = (e) => {
		e.preventDefault();
		saveAs(`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${url}`, "Links-QR.jpg");
	};

	const ImagePlaceholder = () => (
		<div className="w-[320px] h-[320px] max-w-[80vw] my-4 bg-gray-200 grid place-items-center">
			<div className="loader rounded-full border-8 border-t-8 border-gray-300 border-t-[#eb7f00] h-20 w-20 sm:h-24 sm:w-24" />
		</div>
	);

	return (
		<Modal
			style={{ zIndex: 50, height: "100vh", width: "100vw", display: "grid", placeItems: "center" }}
			open={showQR}
			onClose={() => setShowQR(false)}
		>
			<div className="relative outline-none bg-gray-100 rounded-md p-4">
				<IconButton
					style={{ position: "absolute" }}
					className="absolute top-2 right-2"
					onClick={() => setShowQR(false)}
				>
					<XIcon className="w-6 h-6" />
				</IconButton>
				<h1 className="text-2xl font-bold">QR Code</h1>
				<p className="my-2 w-full h-0.5 bg-gray-200"></p>
				{!imageLoaded && <ImagePlaceholder />}
				<img
					onLoad={() => setImageLoaded(true)}
					className={`p-2 border max-w-[80vw] my-4 ${!imageLoaded && "hidden"}`}
					src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${url}`}
				/>
				<button
					onClick={downloadQR}
					className="bg-[#eb7f00] text-white font-medium w-full p-2 text-center rounded-sm flex items-center justify-center space-x-2"
				>
					<DownloadIcon className="w-6 h-6" />
					<span>Download PNG</span>
				</button>
			</div>
		</Modal>
	);
};

export default QRCode;
