import moment from "moment";
import React, { useState } from "react";
import LinkIcon from "@heroicons/react/outline/LinkIcon";
import CopyIcon from "@heroicons/react/outline/DuplicateIcon";
import QRIcon from "@heroicons/react/outline/QrcodeIcon";
import DestinationIcon from "@heroicons/react/outline/SwitchHorizontalIcon";
import ChartIcon from "@heroicons/react/solid/ChartBarIcon";
import DeleteIcon from "@heroicons/react/outline/TrashIcon";
import toast, { Toaster } from "react-hot-toast";
import QRCode from "./QRCode";
import Analytics from "./Analytics";

const LinkDetails = ({ link, className = "" }) => {
	const [showQR, setShowQR] = useState(false);

	const deleteHandler = () => {
		fetch("/api/deleteLink", {
			method: "DELETE",
			body: JSON.stringify({ _id: link?._id }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) return toast.error(res.error);
				window.location.reload();
			})
			.catch(() => toast.error("Unexpected error occured"));
	};

	const copyHandler = (e) => {
		e.preventDefault();
		navigator?.clipboard
			?.writeText(process.env.NEXT_PUBLIC_BASE_URL + "/" + link?.short)
			.then(() => toast.success("Copied to clipboard!"))
			.catch(() => toast.error("Unable to copy!"));
	};

	const showQRCode = (e) => {
		e.preventDefault();
		setShowQR(true);
	};

	return (
		<div className={className + " select-none flex flex-col space-y-5"}>
			<QRCode
				showQR={showQR}
				setShowQR={setShowQR}
				url={process.env.NEXT_PUBLIC_BASE_URL + "/" + link?.short}
			/>
			<Toaster position="bottom-center" reverseOrder={false} />
			<div className="mt-5 flex items-center justify-between">
				<p>
					<span className="uppercase text-gray-500">
						{moment(link?.created).format("MMM D YYYY, H:mm")}{" "}
					</span>
					<span className="text-[#eb7f00] font-medium">- {link?.createdBy?.name}</span>
				</p>
				<p onClick={deleteHandler} className="flex items-center space-x-1 p-2 rounded-md cursor-pointer active:bg-gray-200 active:text-gray-600 transition-all duration-500">
					<DeleteIcon className="h-6 w-6" />
					<span>Delete</span>
				</p>
			</div>
			<div className="border border-blue-500 rounded-lg px-4 py-2 flex flex-col xs:flex-row items-center">
				<div className="flex flex-1 self-start xs:self-center">
					<LinkIcon className="w-5 h-5 mr-2 text-gray-500" />
					<a
						className="line-clamp-1 break-all"
						href={link?.long}
						target="_blank"
						rel="noopener noreferrer"
					>
						{process.env.NEXT_PUBLIC_BASE_URL + "/" + link?.short}
					</a>
				</div>
				<div className="w-full xs:w-auto flex items-center text-white xs:text-blue-500 xs:space-x-2 bg-blue-400 xs:bg-transparent rounded-md xs:rounded-none mt-2 xs:mt-0">
					<div
						onClick={copyHandler}
						className="w-1/2 xs:w-auto flex items-center justify-center xs:justify-start space-x-1 cursor-pointer active:text-gray-200 xs:active:text-blue-400 xs:hover:bg-gray-200 p-2 xs:rounded-md border-r xs:border-r-0"
					>
						<CopyIcon className="w-5 h-5" />
						<span>Copy</span>
					</div>
					<div
						onClick={showQRCode}
						className="w-1/2 xs:w-auto flex items-center justify-center xs:justify-start space-x-1 cursor-pointer active:text-gray-200 xs:active:text-blue-400 xs:hover:bg-gray-200 p-2 xs:rounded-md"
					>
						<QRIcon className="w-5 h-5" />
						<span>QR Code</span>
					</div>
				</div>
			</div>
			<div className="flex pb-4 border-b border-gray-200">
				<div className="flex items-center h-1/2">
					<DestinationIcon className="w-4 h-4 mr-2 text-gray-500" />
				</div>
				<div className="flex flex-col ">
					<p className="font-bold">Destination:</p>
					<p className="break-all">{link?.long}</p>
				</div>
			</div>
			<div className="">
				<div className="flex items-baseline space-x-2">
					<h1 className="text-3xl font-bold">{link?.timesAccessed}</h1>
					<ChartIcon className="h-4 w-4" />
				</div>
				<p className="text-sm text-gray-500">TOTAL CLICKS</p>
			</div>
			<Analytics analytics={link?.analytics} />
		</div>
	);
};

export default LinkDetails;
