"use client";
import { useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar , ReferenceLine } from "recharts";
import Styles from "@/app/dashboard/dashboard.module.css";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Fonction pour grouper les courses par semaine
function groupByWeek(runningData, startDate) {
	const start = dayjs(startDate);
	const weeks = [0, 1, 2, 3].map(i => {
	const weekStart = start.add(i*7,"day");
	const weekEnd = weekStart.add(6, "day");

	const totalDistance = runningData
		.filter(a =>
		dayjs(a.date).isSameOrAfter(weekStart) &&
		dayjs(a.date).isSameOrBefore(weekEnd) 
		)
		.reduce((sum, a) => sum + a.distance, 0);

	return {
		week: `S${i + 1}`,
		totalDistance
	};
	});

	return weeks;
}

// Fonction pour calculer la moyenne
function averageDistance(weeks) {
	const total = weeks.reduce((sum, w) => sum + w.totalDistance, 0);
	return Math.round(total / weeks.length);
}

// Composant principal
export default function RunningChart({ runningData }) {
	const [startDate, setStartDate] = useState(dayjs().subtract(27, "day"));
	
	if (!runningData) {
		return <p>Chargement des données...</p>;
	}

	// Calcul des semaines et moyenne
	const weeks = groupByWeek(runningData, startDate);
	const average = averageDistance(weeks);
	const endDate=startDate.add(27,"day");


	return (
		<section>
			<div className={Styles.chart_km}>
				<div className={Styles.km_header}>
					<h4>{average}km en moyenne</h4>
					<button onClick={() => setStartDate(prev => prev.subtract(4, "week"))}>&lt;</button>
					<span>{startDate.format("DD MMM")} - {endDate.format("DD MMM")}</span>
					<button onClick={() => setStartDate(prev => prev.add(4, "week"))}>&gt;</button>
				</div>
				<p className={Styles.km_title}>Total des kilomètres des 4 dernières semaines</p>
				<BarChart width={403} height={350} data={weeks}>
				<XAxis dataKey="week" orientation="bottom" dy={10} tickLine={false} tick={{fontSize:12}}/>
				<YAxis tickLine={false} domain={[0, 30]} ticks={[0, 10, 20, 30]} tick={{fontSize:10}}/>
				<Tooltip />
				<Legend iconType="circle" iconSize={8} align="left" formatter={(value) => <span style={{ color: "#707070" }}>{value}</span>}  wrapperStyle={{ fontSize: 12, marginLeft:40 }}/>
				<ReferenceLine y={14} stroke="#f1f1f1" strokeDasharray="2 2" />
				<ReferenceLine y={28} stroke="#f1f1f1" strokeDasharray="2 2" />
				<Bar dataKey="totalDistance" name="km" fill="#b6bdfc" radius={30} barSize={14} />
				</BarChart>
			</div>
		</section>
	);
}
