import React, { useState } from "react";
import ChartSolidIcon from "@heroicons/react/solid/ChartBarIcon";
import ChartOutlineIcon from "@heroicons/react/outline/ChartBarIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import ChevronIcon from "@heroicons/react/outline/ChevronRightIcon";
import IconButton from "@mui/material/IconButton";
import moment from "moment";

const LinksTableSM = ({ links, activeLink, setActiveLink, className = "" }) => {
	const [showDialog, setShowDialog] = useState(false);

	const LinksDialogBox = () => {
    const activateLink = (i) => {
      setActiveLink(i);
      setShowDialog(false);
    }
		return (
			<div className="absolute bg-gray-100 w-full -mx-4 px-2">
        <div className="flex justify-end py-2">
				<IconButton className="ml-auto" onClick={() => setShowDialog(false)}>
					<XIcon className="h-7 w-7" />
				</IconButton>
        </div>
				{links.map((link, i) => (
					<div
						onClick={() => activateLink(i)}
						key={link._id}
						className={`relative p-4 border-gray-300 cursor-pointer border-t ${
							i === activeLink && "bg-white"
						}`}
					>
						<div className="absolute bottom-2 right-4 flex items-center space-x-0.5">
							<span className="text-sm">{link.timesAccessed}</span>
							{i === activeLink ? (
								<ChartSolidIcon className="w-4 h-4" />
							) : (
								<ChartOutlineIcon className="w-4 h-4" />
							)}
						</div>
						<p className="text-sm text-gray-500 uppercase">
							{moment(link.created).format("DD MMM YYYY")}
						</p>
						<h3 className="text-xl mb-2 line-clamp-1 break-words">{link.long.split("/")[2]}</h3>
						<p className="text-sm font-bold text-[#eb7f00] line-clamp-1 max-w-[85%] break-words">
							{process.env.NEXT_PUBLIC_BASE_URL.split("/")[2] + "/" + link.short}
						</p>
					</div>
				))}
			</div>
		);
	};

	return (
		<div className={className + " "}>
			{showDialog ? (
				<LinksDialogBox />
			) : (
				<div
					onClick={() => setShowDialog(true)}
					className={`relative mt-4 p-4 rounded-lg cursor-pointer bg-white`}
				>
					<div className="absolute right-1 top-0 flex items-center h-full">
						<ChevronIcon className="w-6 h-6 text-gray-500" />
					</div>
					<div className="absolute bottom-2 right-6 flex items-center space-x-0.5">
						<span className="text-sm">{links[activeLink || 0].timesAccessed}</span>
						<ChartSolidIcon className="w-4 h-4" />
					</div>
					<p className="text-sm text-gray-500 uppercase">
						{moment(links[activeLink || 0].created).format("DD MMM YYYY")}
					</p>
					<h3 className="text-xl mb-2 line-clamp-1 break-words">
						{links[activeLink || 0].long.split("/")[2]}
					</h3>
					<p className="text-sm font-bold text-[#eb7f00] line-clamp-1 max-w-[85%] break-words">
						{process.env.NEXT_PUBLIC_BASE_URL.split("/")[2] + "/" + links[activeLink || 0].short}
					</p>
				</div>
			)}
		</div>
	);
};

export default LinksTableSM;
