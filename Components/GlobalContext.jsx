"use client";
import { createContext, useState, useContext, useEffect} from "react"

// const GlobalContext=createContext();

// export function GlobalProvider({children}){
// 	// * NOTE: CALCUL SEMAINE EN COURS
// 	const [startEndWeek, setStartEndWeek] = useState({
// 		range: { start: "", end: "" },
// 		activities: [],
// 	});

// 	useEffect(() => {
// 		const today = new Date();

// 		const day = today.getDay();
// 		const diffToMonday = day === 0 ? 6 : day - 1;
// 		const monday = new Date(today);
// 		monday.setDate(today.getDate() - diffToMonday);

// 		const sunday = new Date(monday);
// 		sunday.setDate(monday.getDate() + 6);

// 		const start = monday.toISOString().split("T")[0];
// 		const end = sunday.toISOString().split("T")[0];

		
// 		fetch(`http://localhost:8000/api/user-activity?startWeek=${start}&endWeek=${end}`,
// 			{
// 				method:"GET",
// 				credentials:"include"
// 			}
// 		)
// 			.then((response) => response.json())
// 			.then((data) => {

// 				console.log("DATA REÇUE →", data);
				
// 				setStartEndWeek({
// 					range: { start, end },
// 					activities: data,
// 				});
// 			})
// 		.catch((err) => console.error(err));
// 	}, []);

// 	return (
// 		<GlobalContext.Provider value={{ startEndWeek}}>
// 			{children}
// 		</GlobalContext.Provider>
// 	);
// }






// // 🔹 Création du contexte global
// const GlobalContext = createContext();

// export function GlobalProvider({ children }) {
//   //-------------------------------------------------------------
//   // 🔹 Données pour le RunningChart (4 semaines)
//   //-------------------------------------------------------------
//   const [running, setRunning] = useState({
//     start: "",
//     end: "",
//     activities: [],
//     range: { start: "", end: "" },
//     loading: false
//   });

//   //-------------------------------------------------------------
//   // 🔹 Données pour le HeartRateChart (1 semaine)
//   //-------------------------------------------------------------
//   const [heartRate, setHeartRate] = useState({
//     start: "",
//     end: "",
//     bpmData: [],
//     loading: false
//   });

//   //-------------------------------------------------------------
//   // 🔹 FETCH des activités
//   //-------------------------------------------------------------
//   const fetchActivities = async (startDate) => {
//     setRunning(prev => ({ ...prev, loading: true }));
//     setHeartRate(prev => ({ ...prev, loading: true }));

//     const monday = new Date(startDate);

//     // 🔹 Calcul de la fin de semaine pour HeartRate (1 semaine)
//     const sunday = new Date(monday);
//     sunday.setDate(sunday.getDate() + 6);

//     // 🔹 Calcul du mois pour Running (4 semaines)
//     const endRunning = new Date(monday);
//     startRunning.setDate(endRunning.getDate() + 27);

//     const startStr = monday.toISOString().split("T")[0];
//     const endHeartRateStr = sunday.toISOString().split("T")[0];
//     const endRunningStr = endRunning.toISOString().split("T")[0];

//     // 🔹 Fetch unique pour toutes les activités
//     const res = await fetch(
//       `http://localhost:8000/api/user-activity?startWeek=${startStr}&endWeek=${endRunningStr}`,
//       { credentials: "include" }
//     );
//     const data = await res.json();

//     // 🔹 Mise à jour du running
//     setRunning({
//       start: startStr,
//       end: endRunningStr,
//       activities: data,
//       range: { start: startStr, end: endRunningStr },
//       loading: false
//     });

//     // 🔹 Extraction des BPM pour le HeartRateChart
//     const bpmData = data
//       .filter(activity => {
//         // 🔹 On prend uniquement la semaine courante pour HeartRate
//         const activityDate = new Date(activity.date);
//         return activityDate >= monday && activityDate <= sunday;
//       })
//       .map(activity => ({
//         date: activity.date,
//         minBpm: activity.heartRate.min,
//         maxBpm: activity.heartRate.max,
//         avgBpm: activity.heartRate.average
//       }));

//     setHeartRate({
//       start: startStr,
//       end: endHeartRateStr,
//       bpmData,
//       loading: false
//     });
//   };

//   //-------------------------------------------------------------
//   // 🔹 Navigation RunningChart
//   //-------------------------------------------------------------
// //   const goToNextMonth = () =>
// //     fetchActivities(new Date(running.start).setDate(new Date(running.start).getDate() + 28));
// //   const goToPreviousMonth = () =>
// //     fetchActivities(new Date(running.start).setDate(new Date(running.start).getDate() - 28));

// // 🔹 Navigation
// const goToNextMonth = () => {
//   const newEndDate = new Date(running.end);
//   newEndDate.setDate(newEndDate.getDate() + 28); // avance de 28 jours
//   fetchRunning(newEndDate);
// };

// const goToPreviousMonth = () => {
//   const newEndDate = new Date(running.start);
//   newEndDate.setDate(newEndDate.getDate() - 1); // on prend la veille du début actuel
//   fetchRunning(newEndDate);
// };

//   //-------------------------------------------------------------
//   // 🔹 Navigation HeartRateChart
//   //-------------------------------------------------------------
//   const goToNextWeek = () =>
//     fetchActivities(new Date(heartRate.start).setDate(new Date(heartRate.start).getDate() + 7));
//   const goToPreviousWeek = () =>
//     fetchActivities(new Date(heartRate.start).setDate(new Date(heartRate.start).getDate() - 7));

//   //-------------------------------------------------------------
//   // 🔹 Chargement initial
//   //-------------------------------------------------------------
//   useEffect(() => {
//     const today = new Date();
//     const day = today.getDay();
//     const diffToMonday = day === 0 ? 6 : day - 1; // si dimanche = 0
//     const monday = new Date(today);
//     monday.setDate(today.getDate() - diffToMonday);

//     fetchActivities(monday);
//   }, []);

//   //-------------------------------------------------------------
//   // 🔹 Valeur envoyée aux composants
//   //-------------------------------------------------------------
//   return (
//     <GlobalContext.Provider
//       value={{
//         running,
//         heartRate,
//         goToNextMonth,
//         goToPreviousMonth,
//         goToNextWeek,
//         goToPreviousWeek
//       }}
//     >
//       {children}
//     </GlobalContext.Provider>
//   );
// }

// // 🔹 Hook pratique pour utiliser le contexte
// export const useUser = () => useContext(GlobalContext);




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

		const end = endDate ? new Date(endDate) : new Date(); // dernier jour de la semaine
		const start = new Date(end);
		start.setDate(end.getDate() - 7); // 7 jours pour la semaine

		const startStr = start.toISOString().split("T")[0];
		const endStr = end.toISOString().split("T")[0];

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

