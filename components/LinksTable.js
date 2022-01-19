const LinksTable = ({ links }) => (
	<div className="max-w-screen max-h-[90vh] overflow-y-scroll relative">
		<table className="border-2 border-b-0 max-w-screen ">
			<thead className="sticky top-[-1px]">
				<tr className="border-b-2 max-w-screen bg-gray-500 text-white">
					{/* <th className="p-2 font-medium border-r-2">Created</th> */}
					<th className="p-2 font-medium border-r-2">Original URL</th>
					<th className="p-2 font-medium border-r-2">Short URL</th>
					{/* <th className="p-2 font-medium border-r-2">Last Accessed</th> */}
					<th className="p-2 font-medium">Times Accessed</th>
				</tr>
			</thead>
			<tbody>
				{links.map((link, i) => (
					<tr key={link?._id} className={`max-w-screen border-b-2 ${i % 2 === 1 && "bg-gray-300"}`}>
						{/* <td className="text-center p-2 border-r-2">
								{new Date(link?.created).toLocaleString()}
							</td> */}
						<td className="text-center p-2 border-r-2">
							<a
								href={link?.long}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 underline active:text-blue-700 break-all"
							>
								{link?.long}
							</a>
						</td>
						<td className="text-center p-2 border-r-2">
							<a
								href={process.env.NEXT_PUBLIC_BASE_URL + "/" + link?.short}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 underline active:text-blue-700 break-all"
							>
								{process.env.NEXT_PUBLIC_BASE_URL + "/" + link?.short}
							</a>
						</td>
						{/* <td className="text-center p-2 border-r-2">
								{new Date(link?.lastAccessed).toLocaleString()}
							</td> */}
						<td className="text-center p-2">{link?.timesAccessed}</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export default LinksTable;
