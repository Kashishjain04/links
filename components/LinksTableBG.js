import ChartOutlineIcon from "@heroicons/react/outline/ChartBarIcon";
import ChartSolidIcon from "@heroicons/react/solid/ChartBarIcon";
import moment from "moment";

const LinksTableBG = ({ links, activeLink, setActiveLink, className = "" }) => {
	const deleteLink = (link) => {
		fetch("/api/deleteLink", {
			method: "DELETE",
			body: JSON.stringify({ _id: link._id }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) return alert(res.error);
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
				alert("Unexpected error occured");
			});
	};
	return (
		<div className={className + " overflow-y-scroll relative bg-gray-200 hide-scrollbar"}>
			{links.map((link, i) => (
				<div
					onClick={() => setActiveLink(i)}
					key={link._id}
					className={`relative p-4 border-gray-300 cursor-pointer ${i > 0 && "border-t"} ${
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
			{/* <table className="border-2 border-b-0 max-w-screen ">
				<thead className="sticky top-[-1px]">
					<tr className="border-b-2 max-w-screen bg-gray-500 text-white">
						<th className="p-2 font-medium border-r-2">Created</th>
						<th className="p-2 font-medium border-r-2">Original URL</th>
						<th className="p-2 font-medium border-r-2">Short URL</th>
						<th className="p-2 font-medium border-r-2">Last Accessed</th>
						<th className="p-2 font-medium border-r-2">Clicked</th>
						<th className="p-2 font-medium">Delete</th>
					</tr>
				</thead>
				<tbody>
					{links.map((link, i) => (
						<tr
							key={link?._id}
							className={`max-w-screen border-b-2 ${i % 2 === 1 && "bg-gray-300"}`}
						>
							<td className="text-center p-2 border-r-2">
								{new Date(link?.created).toLocaleString()}
							</td>
							<td className="text-center p-2 border-r-2 w-[50%]">
								<a
									href={link?.long}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 underline active:text-blue-700 break-all line-clamp-3 max-w-[400px]"
								>
									{link?.long}
								</a>
							</td>
							<td className="text-center p-2 border-r-2 w-[50%]">
								<a
									href={process.env.NEXT_PUBLIC_BASE_URL + "/" + link?.short}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 underline active:text-blue-700 break-all line-clamp-3 max-w-[400px]"
								>
									{process.env.NEXT_PUBLIC_BASE_URL + "/" + link?.short}
								</a>
							</td>
							<td className="text-center p-2 border-r-2">
								{new Date(link?.lastAccessed).toLocaleString()}
							</td>
							<td className="text-center p-2 border-r-2">{link?.timesAccessed}</td>
							<td className="text-center p-2">
								<IconButton onClick={() => deleteLink(link)}>
									<TrashIcon className="w-6 sm:w-6 h-6 sm:h-6" />
								</IconButton>
							</td>
						</tr>
					))}
				</tbody>
			</table> */}
		</div>
	);
};

export default LinksTableBG;
