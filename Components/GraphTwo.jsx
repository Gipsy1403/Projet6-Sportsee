"use client";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import isBetween from "dayjs/plugin/isBetween";
import {ResponsiveContainer,BarChart,Bar,Line,LineChart,XAxis,YAxis,CartesianGrid,Tooltip, ReferenceLine, Legend} from "recharts";
import { useState } from "react";
import "dayjs/locale/fr";
import Styles from "@/app/dashboard/dashboard.module.css";
// import { useMockData } from "./GlobalContextMOCK";

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.locale("fr");

function calculateWeekAverage(weekData){
	const daysWithData = weekData.filter(day => day.average !== null);
	const total = daysWithData.reduce((sum, day) => sum + day.average, 0);
	return daysWithData.length > 0 ? total / daysWithData.length : 0;
}

function getWeekHeartRateData(runningData, selectedDate){
	const weekStart = dayjs(selectedDate).isoWeekday(1).startOf("day"); // lundi
	const weekEnd = dayjs(selectedDate).isoWeekday(7).endOf("day");   // dimanche

	// créer les 7 jours
	const weekDays = [];
	for (let i = 0; i < 7; i++) {
		const day = weekStart.add(i, "day");
		const label = day.format("ddd").replace(".","").charAt(0).toUpperCase() + day.format("ddd").replace(".", "").slice(1);
		weekDays.push({ label, date: day, min: null, max: null, average: null });
	}

	// associer les données existantes
	if (Array.isArray(runningData)) {
	runningData.forEach((entry) => {
		const d = dayjs(entry.date);
		if (d.isBetween(weekStart, weekEnd, null, "[]")) {
		const index = d.isoWeekday() - 1;
		weekDays[index].min = entry.heartRate.min;
		weekDays[index].max = entry.heartRate.max;
		weekDays[index].average = entry.heartRate.average;
		}
	});
	}
	return weekDays;
};

export default function WeekHeartRateChart({ runningData }){
	// const { StartEndWeek } = useMockData();
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [lineColor, setLineColor] = useState('#f2f3ff');
 
	const weekData = getWeekHeartRateData(runningData, selectedDate);
	// console.log("weekdata:", weekData)
	const weekStart = dayjs(selectedDate).isoWeekday(1); 
	const weekEnd = dayjs(selectedDate).isoWeekday(7); 
	const weekAverage = calculateWeekAverage(weekData);

	return (
	<section>
		<div className={Styles.chart_bpm}>
			<div className={Styles.bpm_header}>
				<h4>{Math.round(weekAverage)} BPM</h4>
				<div>
					<button onClick={() => setSelectedDate(prev => dayjs(prev).subtract(7, "day"))}>&lt;</button>
					<span> {weekStart.format("DD MMM")} - {weekEnd.format("DD MMM")} </span>
					<button onClick={() => setSelectedDate(prev => dayjs(prev).add(7, "day"))}>&gt;</button>
				</div>
			</div>
			<p className={Styles.bpm_title}>Fréquence cardiaque moyenne</p>
			<ResponsiveContainer width={503} height={350}>
				<BarChart data={weekData} onMouseEnter={()=>setLineColor("#0b23f4")} onMouseLeave={()=>setLineColor("#f2f3ff")}>
				<CartesianGrid strokeDasharray="3 3" vertical={false}/>
				<XAxis dataKey="label" tickLine={false} orientation="bottom" dy={10} tick={{fontSize:12}}/>
				<YAxis tickLine={false} domain={[130, 187]} ticks={[130, 145, 160, 187]} tick={{fontSize:10}}/>
				<Bar dataKey="min" fill="#fcc1b6" radius={30} barSize={14} name="Min" legendType="square"/>
				<Bar dataKey="max" fill="#f4320b" radius={30} barSize={14} name="Max" legendType="square"/>
				<Line type="monotone" dataKey="average" stroke={lineColor} strokeWidth={3} dot={{ r: 3 ,stroke: '#0b23f4',fill: '#0b23f4'}} name="Moyenne BPM" legendType="line" activeDot={{ r: 5, stroke: '#0b23f4', strokeWidth: 2, fill: '#0b23f4' }}/>
				<Legend
					payload={[
					{ value: 'Moyenne BPM', type: 'line', color: '#f2f3ff' },
					{ value: 'Max', type: 'square', color: '#f4320b' },
					{ value: 'Min', type: 'square', color: '#fcc1b6' },
					]}
					formatter={(value) => <span style={{ color: '#707070' }}>{value}</span>}
					wrapperStyle={{ fontSize: 12, marginLeft:40 }}
					iconType="circle"
					iconSize={8}
					align="left"
				/>
				<ReferenceLine y={145} stroke="#f1f1f1" strokeDasharray="2 2" />
				<ReferenceLine y={160} stroke="#f1f1f1" strokeDasharray="2 2" />
				<ReferenceLine y={187} stroke="#f1f1f1" strokeDasharray="2 2" />
				</BarChart>
			</ResponsiveContainer>
		</div>
    </section>	
  );
};
