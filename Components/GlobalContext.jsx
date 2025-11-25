"use client";
import { createContext, useState, useContext, useEffect} from "react"

const GlobalContext=createContext();

export function GlobalProvider({children}){
	// * NOTE: CALCUL SEMAINE EN COURS
	const [startEndWeek, setStartEndWeek] = useState({
		range: { start: "", end: "" },
		activities: [],
	});

	useEffect(() => {
		const today = new Date();

		const day = today.getDay();
		const diffToMonday = day === 0 ? 6 : day - 1;
		const monday = new Date(today);
		monday.setDate(today.getDate() - diffToMonday);

		const sunday = new Date(monday);
		sunday.setDate(monday.getDate() + 6);

		const start = monday.toISOString().split("T")[0];
		const end = sunday.toISOString().split("T")[0];

		
		fetch(`http://localhost:8000/api/user-activity?startWeek=${start}&endWeek=${end}`,
			{
				method:"GET",
				credentials:"include"
			}
		)
			.then((response) => response.json())
			.then((data) => {

				console.log("DATA REÇUE →", data);
				
				setStartEndWeek({
					range: { start, end },
					activities: data,
				});
			})
		.catch((err) => console.error(err));
	}, []);

	return (
		<GlobalContext.Provider value={{ startEndWeek}}>
			{children}
		</GlobalContext.Provider>
	);
}

export function useUser() {
	return useContext(GlobalContext);
}