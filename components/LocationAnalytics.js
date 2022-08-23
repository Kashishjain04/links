import React from 'react'
//eslint-disable-next-line
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const LocationAnalytics = ({analytics}) => {
  let locations = {"Others": 0};
  let labels = [];

  
  analytics?.forEach((analytic) => {
    if (locations[analytic.region]) {
      locations[analytic.region] += 1;
    } else {
      labels.push(analytic.region);
      locations[analytic.region] = 1;
    }
  });
  
  const maxValue = Math.max(...Object.values(locations));

  const chartData = {
		datasets: [
			{
				data: locations,
				backgroundColor: ["#eb7f00aa"],
        maxBarThickness: 50,
			},
		],
		labels,
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
        max: Math.max(5, maxValue+1),
        ticks: {
				  stepSize: 1,
        }
			},
		},
	};

  return (
    <div className="relative">
      {/* <p className="text-gray-500 absolute -top-4 right-4">FY: {minTime.getFullYear()}</p> */}
			<Bar className="w-48 h-48" data={chartData} options={chartOptions} />
		</div>
  )
}

export default LocationAnalytics
