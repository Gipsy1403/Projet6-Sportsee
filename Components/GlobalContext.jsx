"use client";
import { createContext, useState, useContext, useEffect} from "react"

// 🔹 Création du contexte global
const GlobalContext = createContext();

export function GlobalProvider({ children }) {

	const [running, setRunning] = useState({
		start: "",
		end: "",
		activities: [],
		range: { start: "", end: "" },
		loading: false
	});


	const [heartRate, setHeartRate] = useState({
		start: "",
		end: "",
		bpmData: [],
		loading: false
	});


	const fetchRunning = async (endDate) => {
		setRunning(prev => ({ ...prev, loading: true }));

		const end = endDate ? new Date(endDate) : new Date(); // dernier jour de la période
		const start = new Date(end);
		start.setDate(end.getDate() - 27); // 28 jours au total

		const startStr = start.toISOString().split("T")[0];
		const endStr = end.toISOString().split("T")[0];

		const res = await fetch(
			`http://localhost:8000/api/user-activity?startWeek=${startStr}&endWeek=${endStr}`,
			{ credentials: "include" }
		);
		const data = await res.json();

		setRunning({
			start: startStr,
			end: endStr,
			activities: data,
			range: { start: startStr, end: endStr },
			loading: false
		});
	};


	const fetchHeartRate = async (endDate) => {
		setHeartRate(prev => ({ ...prev, loading: true }));
		const today = endDate ? new Date(endDate) : new Date();

		// trouve le lundi de la semaine
		const monday = new Date(today);
		const day = monday.getDay(); // 0 = dimanche, 1 = lundi, ...
		const diff = (day === 0 ? -6 : 1 - day);
		monday.setDate(monday.getDate() + diff);

		// trouver le dimanche de la même semaine
		const sunday = new Date(monday);
		sunday.setDate(monday.getDate() + 6);

		const startStr = monday.toISOString().split("T")[0];
		const endStr = sunday.toISOString().split("T")[0];

		const res = await fetch(
			`http://localhost:8000/api/user-activity?startWeek=${startStr}&endWeek=${endStr}`,
			{ credentials: "include" }
		);
		const data = await res.json();

		const bpmData = data.map(activity => ({
			date: activity.date,
			minBpm: activity.heartRate.min,
			maxBpm: activity.heartRate.max,
			avgBpm: activity.heartRate.average
		}));
		console.log("bpmData :",bpmData);
		
		setHeartRate({
			start: startStr,
			end: endStr,
			bpmData,
			loading: false
		});
	};


	const goToNextMonth = () => {
		const newEnd = new Date(running.end);
		newEnd.setDate(newEnd.getDate() + 28);
		fetchRunning(newEnd);
	};

	const goToPreviousMonth = () => {
		const newEnd = new Date(running.start);
		newEnd.setDate(newEnd.getDate() - 1); // la veille du début actuel
		fetchRunning(newEnd);
	};


	const goToNextWeek = () => {
		const newEnd = new Date(heartRate.end);
		newEnd.setDate(newEnd.getDate() + 7);
		fetchHeartRate(newEnd);
	};

	const goToPreviousWeek = () => {
		const newEnd = new Date(heartRate.start);
		newEnd.setDate(newEnd.getDate() - 1);
		fetchHeartRate(newEnd);
	};


	useEffect(() => {
		fetchRunning(new Date());
		fetchHeartRate(new Date());
	}, []);


	return (
	<GlobalContext.Provider value={{running,heartRate,goToNextMonth,goToPreviousMonth,goToNextWeek,goToPreviousWeek}}>
		{children}
	</GlobalContext.Provider>
	);
}

// Hook pour utiliser le contexte
export const useUser = () => useContext(GlobalContext);

