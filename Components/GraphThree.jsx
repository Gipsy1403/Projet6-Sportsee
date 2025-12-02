import { currentWeek } from "@/app/dashboard/page";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Styles from "@/app/dashboard/dashboard.module.css";


function datesWeek(runningData, start, end) {
	const monday = new Date(start);
	const sunday = new Date(end);

	return runningData.filter(run => {
	const runDate = new Date(run.date);
	return runDate >= monday && runDate <= sunday;
	});
}


function calculObjectifs(runningData, start, end, weeklyGoal) {
	const runsThisWeek = datesWeek(runningData, start, end);
	const objectifAccomplished = runsThisWeek.length;
	const objectifNotAccomplished =weeklyGoal-objectifAccomplished;
	return [
		{ name: "réalisées", value: objectifAccomplished },
		{ name: "restantes", value: objectifNotAccomplished>0 ? objectifNotAccomplished:0},
	];
}

function currentWeekStartEnd() {
	const today = new Date();
	const monday = new Date(today);
	const day = monday.getDay(); // 0 = dimanche
	const diff = (day === 0 ? -6 : 1 - day);
	monday.setDate(monday.getDate() + diff);

	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);

	return {
	start: monday.toISOString().split("T")[0],
	end: sunday.toISOString().split("T")[0],
	};
}

function labelAccord(value, name) {
	if (name === "réalisées") {
		return value <= 1 ? `${value} réalisée` : `${value} réalisées`;
	}
	if (name === "restantes") {
		return value <= 1 ? `${value} restante` : `${value} restantes`;
	}
		return `${value} ${name}`;
}

export default function ObjectifsChart({ runningData, weeklyGoal}) {
	const { start, end } = currentWeekStartEnd();
	const objectifData=calculObjectifs(runningData, start,end, weeklyGoal);
	const colors = ["#0b23f4", "#b6bdfc"];
	const objectifAccomplished=objectifData[0].value;
	const objectifLabel= objectifAccomplished<=1 ? "objectif réalisé" : "objectifs réalisés"

	const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
	const RADIAN = Math.PI / 180;
	const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
		x={x}
		y={y}
		fill="black"
		textAnchor={x > cx ? "start" : "end"}
		dominantBaseline="central"
		fontSize={10}
		fontWeight={400}
		color="#707070"
		>
		{labelAccord(objectifData[index].value, objectifData[index].name)} 
		</text>
	);
	};

  return (
    <section>
		<div className={Styles.chart_objectif}>
			<div className={Styles.objectif_title}>
				<h3>{objectifAccomplished}<span className={Styles.objectif_subtitle}> {objectifLabel} sur {weeklyGoal}</span></h3>
			</div>
			<p>Courses hebdomadaire réalisées</p>

			<PieChart width={300} height={200}>
				<Pie
					data={objectifData} // on utilise les données calculées
					dataKey="value"
					nameKey="name"
					cx="50%"
					cy="50%"
					innerRadius={30}
					outerRadius={70}
					label={renderCustomLabel}
					labelLine={false}
					className={Styles.chart_objectif_label}
				>
				{objectifData.map((entry, index) => (
				<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
				))}
				</Pie>
				<Tooltip />
			</PieChart>
		</div>
    </section>
  );
}
