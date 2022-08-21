import ChartOutlineIcon from "@heroicons/react/outline/ChartBarIcon";
import ChartSolidIcon from "@heroicons/react/solid/ChartBarIcon";
import moment from "moment";

const LinksTableBG = ({ links, activeLink, setActiveLink, className = "" }) => {
	return (
		<div className={className + " overflow-y-scroll relative bg-gray-200 hide-scrollbar"}>
			{links?.map((link, i) => (
				<div
					onClick={() => setActiveLink(i)}
					key={link?._id}
					className={`relative p-4 border-gray-300 cursor-pointer ${i > 0 && "border-t"} ${
						i === activeLink && "bg-white"
					}`}
				>
					<div className="absolute bottom-2 right-4 flex items-center space-x-0.5">
						<span className="text-sm">{link?.timesAccessed}</span>
						{i === activeLink ? (
							<ChartSolidIcon className="w-4 h-4" />
						) : (
							<ChartOutlineIcon className="w-4 h-4" />
						)}
					</div>
					<p className="text-sm text-gray-500 uppercase">
						{moment(link?.created).format("DD MMM YYYY")}
					</p>
					<h3 className="text-xl mb-2 line-clamp-1 break-words">{link?.long.split("/")[2]}</h3>
					<p className="text-sm font-bold text-[#eb7f00] line-clamp-1 max-w-[85%] break-words">
						{process.env.NEXT_PUBLIC_BASE_URL.split("/")[2] + "/" + link?.short}
					</p>
				</div>
			))}
		</div>
	);
};

export default LinksTableBG;
