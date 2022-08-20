import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

const Analytics = ({ analytics }) => {
	const minTime = new Date(new Date().getFullYear(), 0, 1); // first day of the year
	const maxTime = new Date(); // today
	let monthsArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	console.log(analytics);

	analytics.forEach((analytic) => {
		const date = new Date(analytic.timestamp);
		const month = date.getMonth();
		if (date >= minTime && data <= maxTime) {
			monthsArray[month] += 1;
		}
	});

  const maxClicks = monthsArray.reduce((a, b) => Math.max(a, b), -Infinity);

	const chartData = {
		datasets: [
			{
				data: monthsArray,
			},
		],
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	};

	const chartOptions = {
    aspectRatio: 3,
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			x: {
				max: 100,
				min: 0,
        grid: {
          display: false,
        },
			},
			y: {
				min: 0,
        max: Math.max(10, maxClicks),
        ticks: {
				  stepSize: 1,
        }
			},
		},
	};

	return (
		<div className="relative">
      <p className="text-gray-500 absolute -top-4 right-4">FY: {minTime.getFullYear()}</p>
			<Line className="w-48 h-48" data={chartData} options={chartOptions} />
		</div>
	);
};

export default Analytics;
