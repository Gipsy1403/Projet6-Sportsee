import { currentWeek } from "@/app/dashboard/page";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Styles from "@/app/dashboard/dashboard.module.css";


function datesWeek(user) {
	const today=new Date();
	const { monday, sunday } = currentWeek(today);
	return user.runningData.filter(run=>{
		const runDate=new Date(run.date);
		return runDate>=monday&&runDate<=sunday;
	})
}

function calculObjectifs(user){
	const runsThisWeek=datesWeek(user);
	const objectifAccomplished = runsThisWeek.length;
	const objectifNotAccomplished = user.weeklyGoal-objectifAccomplished;
	return [
		{ name: "réalisées", value: objectifAccomplished },
		{ name: "restantes", value: objectifNotAccomplished>0 ? objectifNotAccomplished:0},
	];
}


export default function ObjectifsChart({ user }) {
	const objectifData=calculObjectifs(user);
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
		{objectifData[index].value} {objectifData[index].name} 
		</text>
	);
	};

  return (
    <section>
		<div className={Styles.chart_objectif}>
			<div className={Styles.objectif_title}>
				<h3>{objectifAccomplished}<span className={Styles.objectif_subtitle}> {objectifLabel} sur {user.weeklyGoal}</span></h3>
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
				{/* <Legend iconType="circle" iconSize={8}/> */}
			</PieChart>
		</div>
    </section>
  );
}
